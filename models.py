from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password_hash = models.CharField(max_length=255)
    password_salt = models.CharField(max_length=255)
    avatar_url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    language_code = models.CharField(max_length=2)
    auth_token = models.CharField(max_length=255, null=True, blank=True)

class Friendship(models.Model):
    friendship_id = models.AutoField(primary_key=True)
    user_id_1 = models.ForeignKey(User, related_name='friendship_user_1', on_delete=models.CASCADE)
    user_id_2 = models.ForeignKey(User, related_name='friendship_user_2', on_delete=models.CASCADE)
    friendship_status = models.BigIntegerField()

class Match(models.Model):
    match_id = models.AutoField(primary_key=True)
    player_user = models.ForeignKey(User, related_name='player_user', on_delete=models.CASCADE)
    opponent_user = models.ForeignKey(User, related_name='opponent_user', on_delete=models.CASCADE)
    result = models.CharField(max_length=4)
    is_pong = models.BooleanField()
    game_stats_id = models.IntegerField()
    tournament_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Tournament(models.Model):
    tournament_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class TournamentParticipant(models.Model):
    tournament_participant_id = models.AutoField(primary_key=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.FloatField()
    rank = models.IntegerField()

class PongGameStats(models.Model):
    pong_game_stats_id = models.AutoField(primary_key=True)

class TicTacToeGameStats(models.Model):
    tictactoe_game_stats_id = models.AutoField(primary_key=True)