from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import math, random

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
	result = models.IntegerField()
	
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

def is_power_of_two(n: int) -> bool:
	"""Return True if n is a power of two (e.g., 1,2,4,8,16...), else False."""
	return (n & (n - 1) == 0) and n != 0


class Tournament(models.Model):
	name = models.CharField(max_length=100)
	participants = models.ManyToManyField(User, related_name='tournaments_joined', blank=False)

	# Simple boolean to track if the tournament is finished.
	# If not done, it's considered active.
	is_done = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Tournament {self.name} - Done? {self.is_done}"

	def clean(self):
		"""Optional model-level validation to check participant count is a power of two."""
		count = self.participants.count()
		if count == 0:
			raise ValidationError("Tournament must have at least 1 participant.")
		if not is_power_of_two(count):
			raise ValidationError("Number of participants must be a power of 2.")

	def create_first_round_pairs(self):
		"""Randomly shuffle participants and create Pair objects for round 1."""
		all_participants = list(self.participants.all())
		random.shuffle(all_participants)
		round_number = 1
		# Chunk them in pairs
		for i in range(0, len(all_participants), 2):
			user_ = all_participants[i]
			opponent_ = all_participants[i+1]  # i+1 is safe because we have a power-of-2 number of participants
			Pair.objects.create(
				tournament=self,
				round_number=round_number,
				user=user_,
				opponent=opponent_,
				match_played=False
			)

	@property
	def status(self):
		return "done" if self.is_done else "active"


class Pair(models.Model):
	"""
	Each Pair represents a single match‐up in a given round.
	- 'user' and 'opponent' are the two players in this pair.
	- 'round_number' indicates which round it belongs to.
	- 'match_played' indicates if the pair already has a concluded match.
	- 'match' optionally links to the created Match object once it’s recorded.
	"""
	tournament = models.ForeignKey(Tournament, related_name='pairs', on_delete=models.CASCADE)
	round_number = models.PositiveIntegerField(default=1)

	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pair_as_user')
	opponent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pair_as_opponent')

	match = models.OneToOneField(
		'Match',  # or import your Match model
		on_delete=models.SET_NULL,
		null=True, blank=True,
		related_name='pair'
	)

	match_played = models.BooleanField(default=False)

	def __str__(self):
		return f"[Round {self.round_number}] {self.user} vs {self.opponent} (played={self.match_played})"