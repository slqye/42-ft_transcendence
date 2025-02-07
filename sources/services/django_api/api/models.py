from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
	avatar_url = models.CharField(max_length=255, blank=True, default='https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360')
	display_name= models.CharField(max_length=30, blank=True, unique=True)
	language_code = models.CharField(max_length=2, default='en')
	created_at = models.DateTimeField(auto_now_add=True)
	pong_matches_played = models.PositiveIntegerField(default=0)
	pong_wins = models.PositiveIntegerField(default=0)
	pong_draws = models.PositiveIntegerField(default=0)
	pong_losses = models.PositiveIntegerField(default=0)

	tictactoe_matches_played = models.PositiveIntegerField(default=0)
	tictactoe_wins = models.PositiveIntegerField(default=0)
	tictactoe_draws = models.PositiveIntegerField(default=0)
	tictactoe_losses = models.PositiveIntegerField(default=0)

class Friendship(models.Model):
	user_id_1 = models.ForeignKey(User, related_name='friendship_user_1', on_delete=models.CASCADE)
	user_id_2 = models.ForeignKey(User, related_name='friendship_user_2', on_delete=models.CASCADE)
	friendship_status = models.BooleanField(blank=False, default=False)

class Tournament(models.Model):
	name = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

class TournamentParticipant(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	points = models.FloatField()
	rank = models.IntegerField()

class PongGameStats(models.Model):
	user_score = models.PositiveIntegerField(default=0)
	opponent_score = models.PositiveIntegerField(default=0)
	user_fastest_time_to_score = models.PositiveIntegerField(default=0)
	opponent_fastest_time_to_score = models.PositiveIntegerField(default=0)
	user_max_consecutive_goals = models.PositiveIntegerField(default=0)
	opponent_max_consecutive_goals = models.PositiveIntegerField(default=0)
	user_average_time_to_score = models.PositiveIntegerField(default=0)
	opponent_average_time_to_score = models.PositiveIntegerField(default=0)
	longest_bounce_streak = models.PositiveIntegerField(default=0)

class TicTacToeGameStats(models.Model):
	user_score = models.PositiveIntegerField(default=0)
	opponent_score = models.PositiveIntegerField(default=0)
	user_max_consecutive_wins = models.PositiveIntegerField(default=0)
	opponent_max_consecutive_wins = models.PositiveIntegerField(default=0)
	user_wins_as_crosses = models.PositiveIntegerField(default=0)
	opponent_wins_as_crosses = models.PositiveIntegerField(default=0)
	user_wins_as_noughts = models.PositiveIntegerField(default=0)
	opponent_wins_as_noughts = models.PositiveIntegerField(default=0)
	user_quickest_win_as_moves = models.PositiveIntegerField(default=0)
	opponent_quickest_win_as_moves = models.PositiveIntegerField(default=0)

class Match(models.Model):
	host_user = models.ForeignKey(User, related_name='host_user', on_delete=models.CASCADE)
	opponent_user = models.ForeignKey(User, related_name='opponent_user', on_delete=models.CASCADE)
	# Now an integer field. For example: 0 = pending/draw, 1 = win, etc.
	result = models.IntegerField(default=0)
	is_pong = models.BooleanField(blank=False, default=True)
	pong_game_stats = models.OneToOneField(
		PongGameStats, null=True, blank=True, on_delete=models.SET_NULL, related_name='match'
	)
	tictactoe_game_stats = models.OneToOneField(
		TicTacToeGameStats, null=True, blank=True, on_delete=models.SET_NULL, related_name='match'
	)
	tournament_id = models.IntegerField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)


class Invitation(models.Model):
	status = models.BooleanField(default=False)
	result = models.IntegerField(default=0)
	
	host_user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name='invitations_sent'
	)
	opponent_user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name='invitations_received'
	)
	is_pong = models.BooleanField(blank=False, default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	tournament_id = models.IntegerField(null=True, blank=True)
	
	pong_game_stats = models.OneToOneField(
		PongGameStats, null=True, blank=True,
		on_delete=models.SET_NULL,
		related_name='invitation'
	)
	tictactoe_game_stats = models.OneToOneField(
		TicTacToeGameStats, null=True, blank=True,
		on_delete=models.SET_NULL,
		related_name='invitation'
	)