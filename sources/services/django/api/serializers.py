from rest_framework import serializers
from .models import User, Friendship, Match, Tournament, TournamentParticipant, PongGameStats, TicTacToeGameStats

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',  # Default primary key from Django
            'username',
            'password_hash',
            'password_salt',
            'avatar_url',
            'created_at',
            'language_code',
            'auth_token',
        ]
        read_only_fields = ['id', 'created_at']


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


# Match Serializer
class MatchSerializer(serializers.ModelSerializer):
    # Optionally nested users
    player = UserSerializer(read_only=True, source='player_user')
    opponent = UserSerializer(read_only=True, source='opponent_user')

    class Meta:
        model = Match
        fields = [
            'id',  # Default primary key from Django
            'player_user',
            'opponent_user',
            'result',
            'is_pong',
            'game_stats_id',
            'tournament_id',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


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


class PongGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongGameStats
        fields = ['pong_game_stats_id']
        read_only_fields = ['pong_game_stats_id']


class TicTacToeGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicTacToeGameStats
        fields = ['tictactoe_game_stats_id']
        read_only_fields = ['tictactoe_game_stats_id']