from rest_framework import serializers
from .models import User, Friendship, Match, Tournament, TournamentParticipant, PongGameStats, TicTacToeGameStats, Invitation
from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(
		write_only=True,
		required=True,
		style={'input_type': 'password'},
		validators=[validate_password]
	)

	class Meta:
		model = User
		fields = ['id', 'username', 'display_name', 'password', 'avatar_url', 'language_code', 'created_at']
		read_only_fields = ['id', 'created_at']

	def create(self, validated_data):
		user = User(
			username=validated_data['username'],
			display_name=validated_data['display_name'],
			avatar_url=validated_data.get('avatar_url'),  # Let model handle default if not provided
			language_code=validated_data.get('language_code', 'en')
		)
		user.set_password(validated_data['password'])
		user.save()
		return user

	def update(self, instance, validated_data):
		if 'username' in validated_data:
			instance.username = validated_data['username']
		
		if 'display_name' in validated_data:
			instance.display_name = validated_data['display_name']
		
		if 'avatar_url' in validated_data:
			instance.avatar_url = validated_data['avatar_url']
		
		if 'language_code' in validated_data:
			instance.language_code = validated_data['language_code']
		
		if 'password' in validated_data:
			instance.set_password(validated_data['password'])
		
		instance.save()
		return instance
	
	def to_representation(self, instance):
		representation = super().to_representation(instance)
		representation.pop('password', None)
		return representation


# Friendship Serializer
class FriendshipSerializer(serializers.ModelSerializer):
	# Optionally nested user data
	user_1 = UserSerializer(read_only=True, source='user_id_1')
	user_2 = UserSerializer(read_only=True, source='user_id_2')
	
	class Meta:
		model = Friendship
		fields = [
			'id',  # Automatically uses Django's default primary key
			'user_id_1',  # Foreign key fields
			'user_id_2',
			'friendship_status',
		]
		read_only_fields = ['id']



class PongGameStatsSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongGameStats
		fields = [
			'pong_game_stats_id',
			'score_player',
			'score_opponent',
			'number_of_bounces'
		]
		read_only_fields = ['pong_game_stats_id']


class TicTacToeGameStatsSerializer(serializers.ModelSerializer):
	class Meta:
		model = TicTacToeGameStats
		fields = [
			'tictactoe_game_stats_id',
			'total_moves',
			'winning_move_number',
			'board_state'
		]
		read_only_fields = ['tictactoe_game_stats_id']

class MatchSerializer(serializers.ModelSerializer):
	pong_game_stats = PongGameStatsSerializer(required=False, allow_null=True)
	tictactoe_game_stats = TicTacToeGameStatsSerializer(required=False, allow_null=True)

	class Meta:
		model = Match
		fields = [
			'id',
			'player_user',
			'opponent_user',
			'result',
			'is_pong',
			'pong_game_stats',
			'tictactoe_game_stats',
			'tournament_id',
			'created_at'
		]
		read_only_fields = ['id', 'created_at']

	def create(self, validated_data):
		pong_stats_data = validated_data.pop('pong_game_stats', None)
		tictactoe_stats_data = validated_data.pop('tictactoe_game_stats', None)

		# Create the Match instance first
		match = Match.objects.create(**validated_data)

		# If it's a Pong match, create PongGameStats if provided
		if match.is_pong and pong_stats_data is not None:
			pong_stats = PongGameStats.objects.create(**pong_stats_data)
			match.pong_game_stats = pong_stats
			match.save()

		# If it's NOT a Pong match, create TicTacToeGameStats if provided
		elif not match.is_pong and tictactoe_stats_data is not None:
			tictactoe_stats = TicTacToeGameStats.objects.create(**tictactoe_stats_data)
			match.tictactoe_game_stats = tictactoe_stats
			match.save()

		return match


# Tournament Serializer
class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = [
			'id',  # Default primary key from Django
			'name',
			'created_at',
		]
		read_only_fields = ['id', 'created_at']


# Tournament Participant Serializer
class TournamentParticipantSerializer(serializers.ModelSerializer):
	tournament = TournamentSerializer(read_only=True)
	user = UserSerializer(read_only=True)

	class Meta:
		model = TournamentParticipant
		fields = [
			'id',  # Default primary key from Django
			'tournament',
			'user',
			'points',
			'rank',
		]
		read_only_fields = ['id']

class InvitationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Invitation
		fields = [
			'id',
			'from_user',
			'to_user',
			'status',
			'is_pong',
			'created_at',
			'updated_at',
			'tournament_id',
		]
		read_only_fields = [
			'id',
			'from_user',
			'status',
			'created_at',
			'updated_at',
		]

	def create(self, validated_data):
		request = self.context['request']
		from_user = request.user  # The logged-in player_user
		invitation = Invitation.objects.create(
			from_user=from_user,
			**validated_data
		)
		return invitation