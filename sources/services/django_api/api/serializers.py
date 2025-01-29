from rest_framework import serializers
from .models import User, Friendship, Match, Tournament, TournamentParticipant, PongGameStats, TicTacToeGameStats
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'avatar_url', 'language_code', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            avatar_url=validated_data.get('avatar_url', ''),
            language_code=validated_data.get('language_code', 'en')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


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
        fields = '__all__'

class TicTacToeGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicTacToeGameStats
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    pong_game_stats = PongGameStatsSerializer(required=False)
    tictactoe_game_stats = TicTacToeGameStatsSerializer(required=False)

    class Meta:
        model = Match
        fields = '__all__'

    # def create(self, validated_data):
    #     pong_stats_data = validated_data.pop('pong_game_stats', None)
    #     tictactoe_stats_data = validated_data.pop('tictactoe_game_stats', None)
    #     match = Match.objects.create(**validated_data)

    #     if pong_stats_data:
    #         pong_stats = PongGameStats.objects.create(**pong_stats_data)
    #         match.pong_game_stats = pong_stats

    #     if tictactoe_stats_data:
    #         tictactoe_stats = TicTacToeGameStats.objects.create(**tictactoe_stats_data)
    #         match.tictactoe_game_stats = tictactoe_stats

    #     match.save()
    #     return match


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
