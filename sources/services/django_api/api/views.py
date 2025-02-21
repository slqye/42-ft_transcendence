import os
import requests
import math

from django.conf import settings
from django.http import HttpResponse
from django.db import models
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image

from .error_messages import LANGUAGE_ERROR_MESSAGES
from .models import User, Match, Tournament, Pair, Invitation, Friendship
from .serializers import (
	UserSerializer,
	MatchSerializer,
	TournamentSerializer,
	PairSerializer,
	TournamentListSerializer,
	InvitationSerializer,
	FriendshipSerializer,
	PictureSerializer
)

User = get_user_model()

def get_error_message(key: str, request) -> str:
	preferred_lang = request.headers.get("Preferred-Language", "en")
	if preferred_lang not in ("en", "fr", "de"):
		preferred_lang = "en"
	# Fall back to the key itself if not found in the dictionary
	return LANGUAGE_ERROR_MESSAGES.get(key, {}).get(preferred_lang, key)


# ------------------------------ USER AND TOKENS ------------------------------ #

class UserTokenRefreshView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get("user_refresh")
		if refresh_token is None:
			return Response(
				{"detail": get_error_message("Refresh token not provided", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		try:
			refresh = RefreshToken(refresh_token)
			user_id = refresh.payload.get("user_id")
			if not User.objects.filter(id=user_id).exists():
				response = Response(
					{"detail": get_error_message("User not found", request)},
					status=status.HTTP_404_NOT_FOUND
				)
				response.delete_cookie("user_access")
				response.delete_cookie("user_refresh")
				return response
			new_access_token = str(refresh.access_token)
			response = Response({"detail": "Access token refreshed successfully"}, status=status.HTTP_200_OK)
			response.set_cookie("user_access", new_access_token, httponly=True, secure=True, samesite="None")
			return response
		except TokenError:
			response = Response(
				{"detail": get_error_message("Invalid or expired refresh token", request)},
				status=status.HTTP_401_UNAUTHORIZED
			)
			response.delete_cookie("user_access")
			response.delete_cookie("user_refresh")
			return response


class OpponentTokenRefreshView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get("opponent_refresh")
		if refresh_token is None:
			return Response(
				{"detail": get_error_message("Refresh token not provided", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		try:
			refresh = RefreshToken(refresh_token)
			opponent_id = refresh.payload.get("user_id")
			if not User.objects.filter(id=opponent_id).exists():
				response = Response(
					{"detail": get_error_message("Opponent not found", request)},
					status=status.HTTP_404_NOT_FOUND
				)
				response.delete_cookie("opponent_access")
				response.delete_cookie("opponent_refresh")
				return response
			new_access_token = str(refresh.access_token)
			response = Response({"detail": "Access token refreshed successfully"}, status=status.HTTP_200_OK)
			response.set_cookie("opponent_access", new_access_token, httponly=True, secure=True, samesite="None")
			return response
		except TokenError:
			response = Response(
				{"detail": get_error_message("Invalid or expired refresh token", request)},
				status=status.HTTP_401_UNAUTHORIZED
			)
			response.delete_cookie("opponent_access")
			response.delete_cookie("opponent_refresh")
			return response


class UserLogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		request.user.last_active = None
		request.user.save(update_fields=["last_active"])
		response = Response({"detail": "User logged out"}, status=status.HTTP_200_OK)
		response.delete_cookie("user_access")
		response.delete_cookie("user_refresh")
		return response


class OpponentLogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		response = Response({"detail": "Opponent user logged out"}, status=status.HTTP_200_OK)
		response.delete_cookie("opponent_access")
		response.delete_cookie("opponent_refresh")
		return response


class UserLoginView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		username = request.data.get("username")
		password = request.data.get("password")
		user = authenticate(request, username=username, password=password)
		if not user:
			return Response(
				{"detail": get_error_message("Invalid credentials", request)},
				status=status.HTTP_401_UNAUTHORIZED
			)
		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)
		response = Response({"detail": "User logged in successfully"}, status=status.HTTP_200_OK)
		response.set_cookie("user_access", access_token, httponly=True, secure=True, samesite="None")
		response.set_cookie("user_refresh", refresh_token, httponly=True, secure=True, samesite="None")
		return response


class OpponentLoginView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		username = request.data.get("username")
		password = request.data.get("password")
		user = authenticate(request, username=username, password=password)
		if not user:
			return Response(
				{"detail": get_error_message("Invalid credentials", request)},
				status=status.HTTP_401_UNAUTHORIZED
			)
		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)
		response = Response({"detail": "Opponent user logged in successfully"}, status=status.HTTP_200_OK)
		response.set_cookie("opponent_access", access_token, httponly=True, secure=True, samesite="None")
		response.set_cookie("opponent_refresh", refresh_token, httponly=True, secure=True, samesite="None")
		return response


class RegisterUser(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]


class UserList(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get"]


class UserDetail(generics.RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get"]


class UserFetchUsername(generics.RetrieveAPIView):
	permission_classes = [permissions.AllowAny]
	serializer_class = UserSerializer
	queryset = User.objects.all()
	lookup_field = "username"
	http_method_names = ["get"]


class UserFetchIdViaUsernames(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		usernames = request.data.get("usernames")
		if not usernames or not isinstance(usernames, list):
			return Response(
				{"error": get_error_message("A list of usernames must be provided in the request body.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		users = User.objects.filter(username__in=usernames)
		found_usernames = {u.username for u in users}
		not_found = [name for name in usernames if name not in found_usernames]
		if not_found:
			return Response(
				{
					"detail": get_error_message("One or more users not found", request),
					"usernames": not_found
				},
				status=status.HTTP_404_NOT_FOUND
			)
		user_ids = [u.id for u in users]
		return Response({"user_ids": user_ids}, status=status.HTTP_200_OK)


class UpdateUserField(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def post(self, request, field, *args, **kwargs):
		allowed_fields = ["email", "display_name", "avatar_url", "language_code", "password"]
		if field not in allowed_fields:
			return Response(
				{"error": get_error_message("Invalid field", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		new_value = request.data.get(field)
		if new_value is None:
			# e.g. "password is required." if field == "password"
			return Response(
				{"error": get_error_message(f"{field} is required.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		user = request.user
		if field == "password":
			user.set_password(new_value)
		else:
			setattr(user, field, new_value)
		user.save()
		return Response({field: getattr(user, field)}, status=status.HTTP_200_OK)


class CurrentUser(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, *args, **kwargs):
		serializer = UserSerializer(request.user)
		return Response(serializer.data, status=status.HTTP_200_OK)


class UserStats(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		pong_matches = target_user.pong_matches_played
		pong_wins = target_user.pong_wins
		pong_draws = target_user.pong_draws
		pong_losses = target_user.pong_losses
		pong_winrate = round((pong_wins / pong_matches) * 100, 2) if pong_matches > 0 else 0.0

		ttt_matches = target_user.tictactoe_matches_played
		ttt_wins = target_user.tictactoe_wins
		ttt_draws = target_user.tictactoe_draws
		ttt_losses = target_user.tictactoe_losses
		ttt_winrate = round((ttt_wins / ttt_matches) * 100, 2) if ttt_matches > 0 else 0.0

		return Response({
			"pong_matches_played": pong_matches,
			"pong_wins": pong_wins,
			"pong_draws": pong_draws,
			"pong_losses": pong_losses,
			"pong_winrate": pong_winrate,
			"tictactoe_matches_played": ttt_matches,
			"tictactoe_wins": ttt_wins,
			"tictactoe_draws": ttt_draws,
			"tictactoe_losses": ttt_losses,
			"tictactoe_winrate": ttt_winrate,
		}, status=status.HTTP_200_OK)


# ------------------------------ MATCHES ------------------------------ #

class InvitationCreateView(generics.CreateAPIView):
	queryset = Invitation.objects.all()
	serializer_class = InvitationSerializer
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def create(self, request, *args, **kwargs):
		user_type = request.headers.get("X_User_Type", "user")
		opponent = request.data.get("opponent")
		versus_ai = request.data.get("versus_ai")
		if isinstance(versus_ai, str):
			versus_ai = versus_ai.lower() in ["true", "1"]
		try:
			result = int(request.data.get("result"))
		except (TypeError, ValueError):
			return Response(
				{"detail": get_error_message("Result must be provided as an integer.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		if result not in [0, 1, 2]:
			return Response(
				{"detail": get_error_message("Result must be either 0, 1, or 2.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		if user_type != "user":
			return Response(
				{"detail": get_error_message("You must be a 'user' to create an invitation.", request)},
				status=status.HTTP_403_FORBIDDEN
			)
		if versus_ai and opponent is not None:
			return Response(
				{"detail": get_error_message("'opponent' must be None when creating a match versus AI.", request)},
				status=status.HTTP_403_FORBIDDEN
			)
		if versus_ai:
			ai_user = User.objects.filter(username="AI").first()
			if not ai_user:
				return Response(
					{"detail": get_error_message("AI user does not exist.", request)},
					status=status.HTTP_500_INTERNAL_SERVER_ERROR
				)
			mutable_data = request.data.copy()
			mutable_data["opponent_user_id"] = ai_user.id
			if hasattr(request.data, "_mutable"):
				request.data._mutable = True
				request.data["opponent_user_id"] = ai_user.id
			else:
				request._full_data = mutable_data
		return super().create(request, *args, **kwargs)

	def perform_create(self, serializer):
		serializer.save()


class InvitationAcceptView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def post(self, request, pk, *args, **kwargs):
		user_type = request.headers.get("X_User_Type")
		invitation = get_object_or_404(Invitation, pk=pk)
		if not invitation.versus_ai:
			if user_type != "opponent":
				return Response(
					{"detail": get_error_message("You must be an 'opponent' to accept an invitation.", request)},
					status=status.HTTP_403_FORBIDDEN
				)
			if invitation.opponent_user != request.user:
				return Response(
					{"detail": get_error_message("You are not the invited opponent user.", request)},
					status=status.HTTP_403_FORBIDDEN
				)
			opponent_user = invitation.opponent_user
		else:
			if user_type != "user":
				return Response(
					{"detail": get_error_message("You must be a 'user' to create a match versus AI.", request)},
					status=status.HTTP_403_FORBIDDEN
				)
			opponent_user = invitation.opponent_user

		if invitation.status:
			return Response(
				{"detail": get_error_message("Invitation has already been accepted.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)

		host_user = invitation.host_user
		invitation.status = True
		invitation.save()

		# Update user stats
		try:
			if invitation.is_pong:
				host_user.pong_matches_played += 1
				opponent_user.pong_matches_played += 1
				if invitation.result == 0:
					host_user.pong_wins += 1
					opponent_user.pong_losses += 1
				elif invitation.result == 1:
					host_user.pong_losses += 1
					opponent_user.pong_wins += 1
				else:
					host_user.pong_draws += 1
					opponent_user.pong_draws += 1
			else:
				host_user.tictactoe_matches_played += 1
				opponent_user.tictactoe_matches_played += 1
				if invitation.result == 0:
					host_user.tictactoe_wins += 1
					opponent_user.tictactoe_losses += 1
				elif invitation.result == 1:
					host_user.tictactoe_losses += 1
					opponent_user.tictactoe_wins += 1
				else:
					host_user.tictactoe_draws += 1
					opponent_user.tictactoe_draws += 1

			host_user.save()
			opponent_user.save()
		except Exception as e:
			return Response(
				{"detail": get_error_message("Error updating user stats: ", request) + str(e)},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		# Create the match
		try:
			match = Match.objects.create(
				host_user=host_user,
				opponent_user=opponent_user,
				is_pong=invitation.is_pong,
				tournament=invitation.tournament,
				pong_game_stats=invitation.pong_game_stats,
				tictactoe_game_stats=invitation.tictactoe_game_stats,
				result=invitation.result,
				versus_ai=invitation.versus_ai,
			)
		except Exception as e:
			return Response(
				{"detail": get_error_message("Error creating match: ", request) + str(e)},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		match_data = MatchSerializer(match).data
		try:
			invitation.delete()
		except Exception:
			pass

		return Response(
			{"detail": "Invitation accepted. Match created.", "match": match_data},
			status=status.HTTP_201_CREATED
		)


class UserMatches(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		matches = Match.objects.filter(
			models.Q(host_user=target_user) | models.Q(opponent_user=target_user)
		).order_by("-created_at")[:10]
		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class UserPongMatches(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		matches = Match.objects.filter(is_pong=True).filter(
			models.Q(host_user=target_user) | models.Q(opponent_user=target_user)
		).order_by("-created_at")
		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class UserTicTacToeMatches(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		matches = Match.objects.filter(is_pong=False).filter(
			models.Q(host_user=target_user) | models.Q(opponent_user=target_user)
		).order_by("-created_at")
		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------ FRIENDSHIP ------------------------------ #

class FriendshipView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post", "put", "delete"]

	def get_object(self, pk):
		return get_object_or_404(Friendship, pk=pk)

	def post(self, request, pk=None):
		friend_user = get_object_or_404(User, username=pk)
		if friend_user.id == request.user.id:
			return Response(
				{"detail": get_error_message("Cannot create friendship with yourself.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		data = request.data.copy()
		data["user_id_1"] = request.user.id
		data["user_id_2"] = friend_user.id

		if Friendship.objects.filter(
			models.Q(user_id_1=request.user, user_id_2=friend_user)
			| models.Q(user_id_1=friend_user, user_id_2=request.user)
		).exists():
			return Response(
				{"detail": get_error_message("A friendship between these users already exists.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)

		serializer = FriendshipSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk=None):
		if pk is None:
			return Response(
				{"detail": get_error_message("Friendship ID is required for update.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		friendship = self.get_object(pk)
		if friendship.user_id_2 != request.user:
			return Response(
				{"detail": get_error_message("You are not the correct user to accept this friendship.", request)},
				status=status.HTTP_403_FORBIDDEN
			)
		if friendship.friendship_status:
			return Response(
				{"detail": get_error_message("Friendship has already been accepted.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		serializer = FriendshipSerializer(friendship, data={"friendship_status": True}, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk=None):
		if pk is None:
			return Response(
				{"detail": get_error_message("Friendship ID is required for deletion.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		friendship = self.get_object(pk)
		if request.user not in [friendship.user_id_1, friendship.user_id_2]:
			return Response(
				{"detail": get_error_message("Friendship deletion is forbidden.", request)},
				status=status.HTTP_403_FORBIDDEN
			)
		friendship.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)


class FriendListView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)

		friendships = Friendship.objects.filter(
			models.Q(user_id_1=target_user) | models.Q(user_id_2=target_user)
		)
		friend_users = {}
		for fs in friendships:
			if fs.user_id_1 == target_user:
				if not fs.friendship_status:
					continue
				friend = fs.user_id_2
			else:
				friend = fs.user_id_1
			data = UserSerializer(friend).data
			data["friendship_status"] = fs.friendship_status
			friend_users[fs.id] = data

		return Response({"friends": friend_users}, status=status.HTTP_200_OK)


# ------------------------------ TOURNAMENTS ------------------------------ #

class TournamentView(generics.GenericAPIView):
	queryset = Tournament.objects.all()
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get", "post"]

	def get_serializer_class(self):
		return TournamentListSerializer if self.request.method == "GET" else TournamentSerializer

	def get(self, request, *args, **kwargs):
		tournaments = self.get_queryset().order_by("-created_at")
		serializer = self.get_serializer(tournaments, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def post(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data, context={"request": request})
		serializer.is_valid(raise_exception=True)
		tournament = serializer.save()
		first_pair = tournament.pairs.first()
		tournament.next_pair = first_pair
		tournament.save()
		return Response(TournamentSerializer(tournament).data, status=status.HTTP_201_CREATED)


class TournamentDetailView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get", "put", "delete"]

	def get(self, request, pk):
		tournament = get_object_or_404(Tournament, pk=pk)
		serializer = TournamentSerializer(tournament)
		return Response(serializer.data, status=status.HTTP_200_OK)

	def put(self, request, pk):
		tournament = get_object_or_404(Tournament, pk=pk)
		if tournament.is_done:
			return Response(
				{"detail": get_error_message("This tournament is already done.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		pair = tournament.next_pair
		if pair.match_played:
			return Response(
				{"detail": get_error_message("This pair already has a completed match.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		match_id = request.data.get("match_id")
		if not match_id:
			return Response(
				{"detail": get_error_message("Missing match_id.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		match_instance = get_object_or_404(Match, pk=match_id)
		if (pair.user != match_instance.host_user
				or pair.opponent != match_instance.opponent_user
				or match_instance.tournament != pair.tournament):
			return Response(
				{"detail": get_error_message("Match instance does not match the pair instance", request)},
				status=status.HTTP_400_BAD_REQUEST
			)
		match_instance.tournament = pair.tournament
		match_instance.save()

		pair.match = match_instance
		pair.match_played = True
		pair.save()

		match_result = match_instance.result
		if match_result == 0:
			winner, loser = pair.user, pair.opponent
		elif match_result == 1:
			winner, loser = pair.opponent, pair.user
		else:
			return Response(
				{"detail": get_error_message("Cannot advance if the match is a draw.", request)},
				status=status.HTTP_400_BAD_REQUEST
			)

		total_rounds = int(math.log2(tournament.participants.count()))
		next_round = pair.round_number + 1
		tournament.participants_ranking.add(loser)

		if next_round > total_rounds:
			# The tournament ends
			tournament.participants_ranking.add(winner)
			tournament.is_done = True
			tournament.save()
			return Response({
				"detail": f"The tournament has ended. {winner} is the champion!",
				"tournament": TournamentSerializer(tournament).data
			}, status=status.HTTP_200_OK)

		incomplete_pair = Pair.objects.filter(
			tournament=tournament,
			round_number=next_round,
			match_played=False,
			opponent__isnull=True
		)
		if incomplete_pair.exists():
			open_slot = incomplete_pair.first()
			open_slot.opponent = winner
			open_slot.save()
		else:
			Pair.objects.create(
				tournament=tournament,
				is_pong=tournament.is_pong,
				round_number=next_round,
				user=winner,
				opponent=None,
				match_played=False
			)

		pairs_ = tournament.pairs.filter(match_played=False)
		if pairs_.exists():
			pair_ = pairs_.first()
			if pair_.round_number > tournament.next_pair.round_number:
				pair_.round_progression = True
				pair_.save()
			tournament.next_pair = pair_
		else:
			tournament.next_pair = None
		tournament.save()

		return Response({
			"detail": "Match has been successfully linked. Winner advanced.",
			"tournament": TournamentSerializer(tournament).data
		}, status=status.HTTP_200_OK)

	def delete(self, request, pk):
		tournament = get_object_or_404(Tournament, pk=pk)
		tournament.delete()
		return Response({"detail": "Tournament deleted."}, status=status.HTTP_204_NO_CONTENT)


class TournamentFetchPairs(generics.RetrieveAPIView):
	permission_classes = [permissions.AllowAny]
	queryset = Tournament.objects.all()
	http_method_names = ["get"]

	def get(self, request, pk, format=None):
		tournament = get_object_or_404(Tournament, pk=pk)
		pairs = tournament.pairs.all()
		serializer = PairSerializer(pairs, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class TournamentFetchNextPair(generics.RetrieveAPIView):
	permission_classes = [permissions.AllowAny]
	queryset = Tournament.objects.all()
	http_method_names = ["get"]

	def get(self, request, pk, format=None):
		tournament = get_object_or_404(Tournament, pk=pk)
		if not tournament.next_pair:
			return Response(
				{"detail": "Tournament completed.", "current_round": "completed", "next_pair": None},
				status=status.HTTP_200_OK
			)
		serializer = PairSerializer(tournament.next_pair)
		return Response({
			"next_pair": serializer.data,
			"current_round": tournament.next_pair.round_number
		}, status=status.HTTP_200_OK)


class UserTournaments(APIView):
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["get"]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		tournaments = target_user.tournaments_joined.filter(is_done=True).order_by("-created_at")[:10]
		serializer = TournamentSerializer(tournaments, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------ OAUTH & OTHER ------------------------------ #

def index(request, path=None):
	return HttpResponse("")


class OAuthCallbackView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get"]

	def get(self, request):
		role = request.GET.get("role")
		type_ = request.GET.get("type")
		redirect_uri = settings.API_42_REDIRECT_URI

		if role == "user":
			redirect_uri += "?role=user"
		elif role == "opponent":
			redirect_uri += "?role=opponent"
		else:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		if type_ not in ["match_pong", "match_tictactoe", "tournament", "skip"]:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		redirect_uri += f"&type={type_}"
		code = request.GET.get("code")
		if not code:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		try:
			token_response = requests.post(
				"https://api.intra.42.fr/oauth/token",
				data={
					"grant_type": "authorization_code",
					"client_id": os.environ["API_42_UID"],
					"client_secret": os.environ["API_42_SECRET"],
					"code": code,
					"redirect_uri": redirect_uri,
				},
			)
		except Exception:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		if token_response.status_code != 200:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		access_token = token_response.json().get("access_token")
		try:
			user_response = requests.get(
				"https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"}
			)
		except Exception:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		if user_response.status_code != 200:
			return redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=false")

		user_data = user_response.json()
		username = user_data.get("login")
		user, created = User.objects.get_or_create(username=username)
		if created:
			user.email = user_data.get("email")
			user.avatar_url = user_data.get("image", {}).get("link")
			user.display_name = user_data.get("login")
			user.set_unusable_password()
			user.save()

		refresh = RefreshToken.for_user(user)
		acc_token = str(refresh.access_token)
		ref_token = str(refresh)

		response = redirect(f"{settings.MAIN_URL}/home?callback=true&role={role}&type={type_}&success_callback=true")
		if role == "user":
			response.set_cookie("user_access", acc_token, httponly=True, secure=True, samesite="None")
			response.set_cookie("user_refresh", ref_token, httponly=True, secure=True, samesite="None")
		else:
			response.set_cookie("opponent_access", acc_token, httponly=True, secure=True, samesite="None")
			response.set_cookie("opponent_refresh", ref_token, httponly=True, secure=True, samesite="None")
		return response


class FrontendConfigView(APIView):
	permission_classes = [permissions.AllowAny]
	http_method_names = ["get"]

	def get(self, request):
		config = {
			"API_42_UID": settings.API_42_UID,
			"API_42_REDIRECT_URI": settings.API_42_REDIRECT_URI,
		}
		return Response(config, status=status.HTTP_200_OK)


class PictureUploadView(APIView):
	parser_classes = [MultiPartParser, FormParser]
	permission_classes = [permissions.IsAuthenticated]
	http_method_names = ["post"]

	def post(self, request, *args, **kwargs):
		serializer = PictureSerializer(data=request.data)
		if serializer.is_valid():
			image_file = serializer.validated_data.get("image")
			try:
				image_obj = Image.open(image_file)
			except Exception as e:
				return Response(
					{"detail": get_error_message("Error processing image: ", request) + str(e)},
					status=status.HTTP_400_BAD_REQUEST
				)
			if image_obj.size != (512, 512):
				return Response(
					{"detail": get_error_message("Image must be exactly 512x512 pixels.", request)},
					status=status.HTTP_400_BAD_REQUEST
				)
			ext = os.path.splitext(image_file.name)[1]
			user = request.user
			new_name = f"{user.username}{ext}"
			image_file.name = new_name
			upload_dir = os.path.join("user_media", "uploads")

			if os.path.exists(upload_dir):
				for existing_file in os.listdir(upload_dir):
					if existing_file.startswith(user.username + "."):
						try:
							os.remove(os.path.join(upload_dir, existing_file))
						except Exception as remove_err:
							return Response(
								{
									"detail": f"{get_error_message('Error removing old image', request)} "
											  f"{existing_file}: {remove_err}"
								},
								status=status.HTTP_500_INTERNAL_SERVER_ERROR
							)
			else:
				os.makedirs(upload_dir)

			serializer.save()
			user.avatar_url = "frontend/assets" + serializer.data.get("image")
			user.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)