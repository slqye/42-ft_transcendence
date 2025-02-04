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
	friendship_status = models.BigIntegerField()

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
	tictactoe_game_stats_id = models.AutoField(primary_key=True)
	total_moves = models.PositiveIntegerField(default=0)
	winning_move_number = models.PositiveIntegerField(null=True, blank=True)
	board_state = models.JSONField(default=dict)

class Match(models.Model):
	player_user = models.ForeignKey(User, related_name='player_user', on_delete=models.CASCADE)
	opponent_user = models.ForeignKey(User, related_name='opponent_user', on_delete=models.CASCADE)
	result = models.CharField(max_length=4)
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
	STATUS_CHOICES = (
		('pending', 'Pending'),
		('accepted', 'Accepted'),
		('declined', 'Declined'),
	)

	from_user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name='invitations_sent'
	)
	to_user = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name='invitations_received'
	)
	status = models.CharField(
		max_length=10,
		choices=STATUS_CHOICES,
		default='pending'
	)
	is_pong = models.BooleanField(blank=False, default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	tournament_id = models.IntegerField(null=True, blank=True)
	
	# New field for nested Pong game stats
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