from rest_framework import serializers
from .models import User, Friendship, Match, Tournament, Pair, PongGameStats, TicTacToeGameStats, Invitation
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
			'id',
			'user_score',
			'opponent_score',
			'user_fastest_time_to_score',
			'opponent_fastest_time_to_score',
			'user_max_consecutive_goals',
			'opponent_max_consecutive_goals',
			'user_average_time_to_score',
			'opponent_average_time_to_score',
			'longest_bounce_streak'
		]
		read_only_fields = ['id']


class TicTacToeGameStatsSerializer(serializers.ModelSerializer):
	class Meta:
		model = TicTacToeGameStats
		fields = [
			'id',
			'user_score',
			'opponent_score',
			'user_max_consecutive_wins',
			'opponent_max_consecutive_wins',
			'user_wins_as_crosses',
			'opponent_wins_as_crosses',
			'user_wins_as_noughts',
			'opponent_wins_as_noughts',
			'user_quickest_win_as_moves',
			'opponent_quickest_win_as_moves'
		]
		read_only_fields = ['id']

class MatchSerializer(serializers.ModelSerializer):
	# Nested representation for read
	host_user = UserSerializer(read_only=True)
	opponent_user = UserSerializer(read_only=True)
	
	# Write-only fields to accept IDs
	host_user_id = serializers.PrimaryKeyRelatedField(
		write_only=True, source='host_user', queryset=User.objects.all()
	)
	opponent_user_id = serializers.PrimaryKeyRelatedField(
		write_only=True, source='opponent_user', queryset=User.objects.all()
	)
	
	pong_game_stats = PongGameStatsSerializer(required=False, allow_null=True)
	tictactoe_game_stats = TicTacToeGameStatsSerializer(required=False, allow_null=True)

	class Meta:
		model = Match
		fields = [
			'id',
			'host_user',		 # read-only nested
			'opponent_user',	 # read-only nested
			'host_user_id',	  # write-only id
			'opponent_user_id',  # write-only id
			'result',			# now an integer field
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
		
		try:
			match = Match.objects.create(**validated_data)
		except Exception as e:
			raise serializers.ValidationError({"detail": "Error creating match: " + str(e)})
		
		if match.is_pong:
			if pong_stats_data is not None:
				try:
					pong_stats = PongGameStats.objects.create(**pong_stats_data)
					match.pong_game_stats = pong_stats
					match.save()
				except Exception as e:
					raise serializers.ValidationError({"detail": "Error creating Pong game stats: " + str(e)})
		else:
			if tictactoe_stats_data is not None:
				try:
					tictactoe_stats = TicTacToeGameStats.objects.create(**tictactoe_stats_data)
					match.tictactoe_game_stats = tictactoe_stats
					match.save()
				except Exception as e:
					raise serializers.ValidationError({"detail": "Error creating Tic Tac Toe game stats: " + str(e)})
		return match


class InvitationSerializer(serializers.ModelSerializer):
	# Nested representation for read
	host_user = UserSerializer(read_only=True)
	opponent_user = UserSerializer(read_only=True)
	
	# Write-only field to accept the recipient’s user ID
	opponent_user_id = serializers.PrimaryKeyRelatedField(
		write_only=True, source="opponent_user", queryset=User.objects.all()
	)
	
	pong_game_stats = PongGameStatsSerializer(required=False, allow_null=True)
	tictactoe_game_stats = TicTacToeGameStatsSerializer(required=False, allow_null=True)
	
	class Meta:
		model = Invitation
		fields = [
			'id',
			'host_user',			# read-only nested (set automatically)
			'opponent_user',		# read-only nested
			'opponent_user_id',	 # write-only id
			'status',
			'result',
			'is_pong',
			'tournament_id',
			'pong_game_stats',
			'tictactoe_game_stats',
			'created_at',
			'updated_at',
		]
		read_only_fields = ['status', 'created_at', 'updated_at', 'host_user']

	def create(self, validated_data):
		request = self.context['request']
		user = request.user
		
		pong_data = validated_data.pop('pong_game_stats', None)
		ttt_data = validated_data.pop('tictactoe_game_stats', None)
		
		invitation = Invitation.objects.create(host_user=user, **validated_data)
		
		if pong_data:
			try:
				pong_instance = PongGameStats.objects.create(**pong_data)
				invitation.pong_game_stats = pong_instance
				invitation.save()
			except Exception as e:
				raise serializers.ValidationError({"detail": "Error creating Pong game stats: " + str(e)})
		
		if ttt_data:
			try:
				ttt_instance = TicTacToeGameStats.objects.create(**ttt_data)
				invitation.tictactoe_game_stats = ttt_instance
				invitation.save()
			except Exception as e:
				raise serializers.ValidationError({"detail": "Error creating Tic Tac Toe game stats: " + str(e)})
		
		return invitation

class FriendshipSerializer(serializers.ModelSerializer):
	# For read operations: show nested user details.
	user_1 = UserSerializer(read_only=True, source='user_id_1')
	user_2 = UserSerializer(read_only=True, source='user_id_2')
	
	# For write operations: accept user IDs.
	user_id_1 = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.all())
	user_id_2 = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.all())
	
	class Meta:
		model = Friendship
		fields = ['id', 'user_id_1', 'user_id_2', 'friendship_status', 'user_1', 'user_2']
		extra_kwargs = {
			'friendship_status': {'required': False},
		}
	
	def create(self, validated_data):
		validated_data['friendship_status'] = False
		return super().create(validated_data)
	
	def update(self, instance, validated_data):
		# Enforce that only the friendship_status is updated.
		validated_data.pop('user_id_1', None)
		validated_data.pop('user_id_2', None)
		return super().update(instance, validated_data)
	
class PairSerializer(serializers.ModelSerializer):
	# Nested match
	match = MatchSerializer(read_only=True)

	user_id = serializers.PrimaryKeyRelatedField(
		source='user', queryset=User.objects.all(), write_only=True, required=False
	)
	opponent_id = serializers.PrimaryKeyRelatedField(
		source='opponent', queryset=User.objects.all(), write_only=True, required=False
	)

	class Meta:
		model = Pair
		fields = [
			'id',
			'tournament',
			'round_number',
			'user',
			'opponent',
			'user_id',
			'opponent_id',
			'match_played',
			'match',
		]
		read_only_fields = ['id', 'tournament', 'round_number', 'user', 'opponent', 'match_played', 'match']


class TournamentSerializer(serializers.ModelSerializer):
	# Nested pairs
	pairs = PairSerializer(many=True, read_only=True)

	# For creation, accept a list of participant IDs
	participant_ids = serializers.PrimaryKeyRelatedField(
		many=True,
		queryset=User.objects.all(),
		write_only=True,
		required=True
	)

	class Meta:
		model = Tournament
		fields = [
			'id',
			'name',
			'participants',   # read-only
			'participant_ids', # write-only
			'is_done',
			'status',		 # "active" or "done"
			'pairs',		  # nested pairs
			'created_at',
		]
		read_only_fields = ['id', 'participants', 'is_done', 'status', 'pairs', 'created_at']

	def create(self, validated_data):
		participant_ids = validated_data.pop('participant_ids', [])
		# Create the tournament
		tournament = Tournament.objects.create(**validated_data)
		# Ensure no duplicates
		if len(participant_ids) != len(set(participant_ids)):
			raise serializers.ValidationError("Duplicate participants are not allowed.")

		# Add participants
		for user_obj in participant_ids:
			tournament.participants.add(user_obj)

		# Validate number of participants is a power of two
		if not tournament.participants.count() or not self._is_power_of_two(tournament.participants.count()):
			raise serializers.ValidationError("Number of participants must be a power of 2.")

		# Now create first round pairs
		tournament.create_first_round_pairs()

		return tournament

	def _is_power_of_two(self, n):
		return (n & (n - 1) == 0) and n != 0


class TournamentListSerializer(serializers.ModelSerializer):
	"""Simpler serializer for listing all tournaments with their status."""
	class Meta:
		model = Tournament
		fields = ['id', 'name', 'status', 'is_done', 'created_at']
		read_only_fields = fields