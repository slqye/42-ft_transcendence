import os
import requests

from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse, Http404
from django.db import models

from .models import User, Match, TournamentParticipant, Invitation, Friendship
from .serializers import UserSerializer, MatchSerializer, TournamentParticipantSerializer, InvitationSerializer, FriendshipSerializer

from django.contrib.auth import get_user_model, login, authenticate

from rest_framework import generics, permissions, status
# from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import redirect, get_object_or_404

# Create your views here.

User = get_user_model()

############################## USER AND TOKENS ##############################

class UserTokenRefreshView(APIView):
	permission_classes = [permissions.AllowAny]  # Allow access without authentication

	def post(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get('user_refresh')

		if refresh_token is None:
			return Response({"detail": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			refresh = RefreshToken(refresh_token)
			user_id = refresh.payload.get('user_id')
			if not User.objects.filter(id=user_id).exists():
				response = Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
				response.delete_cookie("user_access")
				response.delete_cookie("user_refresh")
				return response

			new_access_token = str(refresh.access_token)

			response = Response({"detail": "Access token refreshed successfully"}, status=status.HTTP_200_OK)
			response.set_cookie(
				"user_access",
				new_access_token,
				httponly=True,
				secure=True,
				samesite='None'
			)
			return response

		except TokenError:
			return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

class OpponentTokenRefreshView(APIView):
	permission_classes = [permissions.AllowAny]  # Allow access without authentication

	def post(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get('opponent_refresh')

		if refresh_token is None:
			return Response({"detail": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			refresh = RefreshToken(refresh_token)
			opponent_id = refresh.payload.get('user_id')
			if not User.objects.filter(id=opponent_id).exists():
				response = Response({"detail": "Opponent not found"}, status=status.HTTP_404_NOT_FOUND)
				response.delete_cookie("opponent_access")
				response.delete_cookie("opponent_refresh")
				return response
			new_access_token = str(refresh.access_token)

			response = Response({"detail": "Access token refreshed successfully"}, status=status.HTTP_200_OK)
			response.set_cookie(
				"opponent_access",
				new_access_token,
				httponly=True,
				secure=True,		# Ensure HTTPS in production
				samesite='None'	 # Adjust based on your frontend setup
			)
			return response

		except TokenError:
			return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
		
class UserLogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, *args, **kwargs):
		response = Response({"detail": "User logged out"})
		# Delete the host_user cookies
		response.delete_cookie("user_access")
		response.delete_cookie("user_refresh")
		return response
	
class OpponentLogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, *args, **kwargs):
		response = Response({"detail": "Opponent user logged out"})
		response.delete_cookie("opponent_access")
		response.delete_cookie("opponent_refresh")
		return response

class UserLoginView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')

		user = authenticate(request, username=username, password=password)
		if not user:
			return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)

		response = Response({"detail": "User logged in successfully"})
		# Set HttpOnly cookies
		# secure=True and samesite='None' typically required if you’re over HTTPS or cross-site
		response.set_cookie(
			"user_access",
			access_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		response.set_cookie(
			"user_refresh",
			refresh_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		return response

class OpponentLoginView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')

		user = authenticate(request, username=username, password=password)
		if not user:
			return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)

		response = Response({"detail": "Opponent user logged in successfully"})
		response.set_cookie(
			"opponent_access",
			access_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		response.set_cookie(
			"opponent_refresh",
			refresh_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		return response

class RegisterUser(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]

class UserList(generics.ListCreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAdminUser]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAdminUser]

class UserFetchUsername(generics.RetrieveAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = UserSerializer
	queryset = User.objects.all()
	lookup_field = 'username'

class UpdateUserField(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, field, *args, **kwargs):
		allowed_fields = ['email', 'display_name', 'avatar_url', 'language_code', 'password']
		
		if field not in allowed_fields:
			return Response({"error": "Invalid field"}, status=400)
		new_value = request.data.get(field, None)
		if new_value is None:
			return Response({"error": f"{field} is required."}, status=400)

		user = request.user
		if field == "password":
			user.set_password(new_value)
		else:
			setattr(user, field, new_value)

		user.save()
		return Response({field: getattr(user, field)}, status=200)

class CurrentUser(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, *args, **kwargs):
		user = request.user
		return Response({
		  'id': user.id,
				'display_name': user.display_name,
		  'username': user.username,
			 'password': user.password,
			'email': user.email,
			'avatar_url': getattr(user, 'avatar_url', None),
			'language_code': getattr(user, 'language_code', 'en'),
		})

class UserStats(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)

		pong_matches = target_user.pong_matches_played
		pong_wins = target_user.pong_wins
		pong_draws = target_user.pong_draws
		pong_losses = target_user.pong_losses

		if pong_matches > 0:
			pong_winrate = round((pong_wins / pong_matches) * 100, 2)
		else:
			pong_winrate = 0.0

		# Tic Tac Toe data
		ttt_matches = target_user.tictactoe_matches_played
		ttt_wins = target_user.tictactoe_wins
		ttt_draws = target_user.tictactoe_draws
		ttt_losses = target_user.tictactoe_losses

		if ttt_matches > 0:
			ttt_winrate = round((ttt_wins / ttt_matches) * 100, 2)
		else:
			ttt_winrate = 0.0

		response_data = {
			"pong_matches_played": pong_matches,
			"pong_wins": pong_wins,
			"pong_draws": pong_draws,
			"pong_losses": pong_losses,
			"pong_winrate": pong_winrate, # percent

			"tictactoe_matches_played": ttt_matches,
			"tictactoe_wins": ttt_wins,
			"tictactoe_draws": ttt_draws,
			"tictactoe_losses": ttt_losses,
			"tictactoe_winrate": ttt_winrate,  # percent
		}

		return Response(response_data)

############################## MATCHES ##############################

class InvitationCreateView(generics.CreateAPIView):
	queryset = Invitation.objects.all()
	serializer_class = InvitationSerializer
	permission_classes = [permissions.IsAuthenticated]

	def create(self, request, *args, **kwargs):
		user_type = request.headers.get('X_User_Type', 'user')
		if request.data['result'] < 0 or request.data['result'] > 2:
			return Response({"detail": "Result must be either 0, 1 or 2"}, status=status.HTTP_400_BAD_REQUEST)
		if user_type != 'user':
			return Response({"detail": "You must be a 'user' to create an invitation."},
							status=status.HTTP_403_FORBIDDEN)
		return super().create(request, *args, **kwargs)

	def perform_create(self, serializer):
		serializer.save()

class InvitationAcceptView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, pk, *args, **kwargs):
		user_type = request.headers.get('X_User_Type')
		if user_type != 'opponent':
			return Response(
				{"detail": "You must be an 'opponent' to accept an invitation."},
				status=status.HTTP_403_FORBIDDEN
			)

		invitation = get_object_or_404(Invitation, pk=pk)

		if invitation.opponent_user != request.user:
			return Response(
				{"detail": "You are not the invited opponent_user."},
				status=status.HTTP_403_FORBIDDEN
			)

		if invitation.status:
			return Response(
				{"detail": "Invitation has already been accepted."},
				status=status.HTTP_400_BAD_REQUEST
			)

		try:
			invitation.status = True
			invitation.save()
		except Exception as e:
			return Response(
				{"detail": "Error updating invitation: " + str(e)},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		host_user = invitation.host_user
		opponent_user = invitation.opponent_user
		# 0 User_1 wins / 1 User_2 wins / 2 draw
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

			# Save updated stats.
			host_user.save()
			opponent_user.save()
		except Exception as e:
			return Response(
				{"detail": "Error updating user stats: " + str(e)},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		# Create the match using the invitation's game stats and result.
		try:
			match = Match.objects.create(
				host_user=host_user,
				opponent_user=opponent_user,
				is_pong=invitation.is_pong,
				tournament_id=invitation.tournament_id,
				pong_game_stats=invitation.pong_game_stats,
				tictactoe_game_stats=invitation.tictactoe_game_stats,
				result=invitation.result  # match result as integer
			)
		except Exception as e:
			return Response(
				{"detail": "Error creating match: " + str(e)},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		# Serialize the created match.
		match_data = MatchSerializer(match).data

		try:
			invitation.delete()
		except Exception as e:
			pass

		return Response({
			"detail": "Invitation accepted. Match created.",
			"match": match_data
		}, status=status.HTTP_201_CREATED)

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
		).order_by('-created_at')[:10]

		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data)

class UserPongMatches(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)

		matches = Match.objects.filter(is_pong=True).filter(
			models.Q(host_user=target_user) | models.Q(opponent_user=target_user)).order_by('-created_at')
		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data)

class UserTicTacToeMatches(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		matches = Match.objects.filter(
			is_pong=False
		).filter(
			models.Q(host_user=target_user) | models.Q(opponent_user=target_user)
		).order_by('-created_at')

		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data)

class UserTournaments(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)

		participants = TournamentParticipant.objects.filter(user=target_user)
		serializer = TournamentParticipantSerializer(participants, many=True)
		return Response(serializer.data)

############################## FRIENDSHIP ##############################

class FriendshipView(APIView):
	permission_classes = [permissions.IsAuthenticated]
	
	def get_object(self, pk):
		return get_object_or_404(Friendship, pk=pk)
	
	def post(self, request, pk=None):
		# Look up the target user by username
		friend_user = get_object_or_404(User, username=pk)
		
		# Prevent a user from creating a friendship with themselves.
		if friend_user.id == request.user.id:
			return Response(
				{"error": "Cannot create friendship with yourself."},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		data = request.data.copy()
		data['user_id_1'] = request.user.id
		data['user_id_2'] = friend_user.id
		
		if Friendship.objects.filter(
			models.Q(user_id_1=request.user, user_id_2=friend_user.id) |
			models.Q(user_id_1=friend_user.id, user_id_2=request.user)
		).exists():
			return Response(
				{"error": "A friendship between these users already exists."},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		serializer = FriendshipSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def put(self, request, pk=None):
		if pk is None:
			return Response({"error": "Friendship ID is required for update."},
							status=status.HTTP_400_BAD_REQUEST)
		
		friendship = self.get_object(pk)
		if friendship.user_id_2 != request.user:
			return Response({"detail": "You are not the correct user to accept this friendship."},
							status=status.HTTP_403_FORBIDDEN)
		if friendship.friendship_status is True:
			return Response({"detail": "Friendship has already been accepted."},
							status=status.HTTP_400_BAD_REQUEST)

		data = {'friendship_status': request.data.get('friendship_status', friendship.friendship_status)}
		serializer = FriendshipSerializer(friendship, data=data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request, pk=None):
		if pk is None:
			return Response({"error": "Friendship ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)
		friendship = self.get_object(pk)
		if request.user != friendship.user_id_1 and request.user != friendship.user_id_2:
			return Response({"error": "Friendship deletion is forbidden."}, status=status.HTTP_403_FORBIDDEN)
		friendship.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class FriendListView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		if pk == "me":
			target_user = request.user
		else:
			target_user = get_object_or_404(User, pk=pk)
		
		friendships = Friendship.objects.filter(
			models.Q(user_id_1=target_user) | models.Q(user_id_2=target_user)
		)

		friend_users = {}
		for friendship in friendships:
			if friendship.user_id_1 == target_user:
				friend = friendship.user_id_2
			else:
				friend = friendship.user_id_1
			serializer = UserSerializer(friend)
			friend_data = serializer.data
			friend_data['friendship_status'] = friendship.friendship_status
			friend_users[friendship.id] = friend_data
		
		return Response({"friends": friend_users})

############################## OAUTH et d'autres trucs ##############################

def index(request, path=None):
	return HttpResponse("")

class OAuthCallbackView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		code = request.GET.get('code')
		if not code:
			return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

		# Exchange code for access token
		try:
			token_response = requests.post(
				'https://api.intra.42.fr/oauth/token',
				data={
				'grant_type': 'authorization_code',
				'client_id': os.environ['API_42_UID'],
				'client_secret': os.environ['API_42_SECRET'],
				'code': code,
					'redirect_uri': settings.API_42_REDIRECT_URI,
				}
			)
		except Exception as e:
			print("Error", e)
			return Response({"error": "Failed to obtain access token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		if token_response.status_code != 200:
			return Response({"error": "Failed to obtain access token"}, status=status.HTTP_400_BAD_REQUEST)

		access_token = token_response.json().get('access_token')

		# Fetch user information
		try:
			user_response = requests.get(
				'https://api.intra.42.fr/v2/me',
				headers={'Authorization': f'Bearer {access_token}'}
			)
		except Exception as e:
			print("Error", e)
			return Response({"error": "Failed to fetch user information"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		if user_response.status_code != 200:
			return Response({"error": "Failed to fetch user information"}, status=status.HTTP_400_BAD_REQUEST)

		user_data = user_response.json()
		username = user_data.get('login')

		# Create or retrieve the user
		user, created = User.objects.get_or_create(username=username)
		if created:
			user.email = user_data.get('email')
			user.avatar_url = user_data.get('image', {}).get('link')
			user.display_name = user_data.get('login')
			user.save()

		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)
		
		response = redirect(f"{settings.MAIN_URL}/home?callback=true")
		response.set_cookie(
			"user_access",
			access_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		response.set_cookie(
			"user_refresh",
			refresh_token,
			httponly=True,
			secure=True,
			samesite='None'
		)
		return response

class FrontendConfigView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		config = {
			"API_42_UID": settings.API_42_UID,
			"API_42_REDIRECT_URI": settings.API_42_REDIRECT_URI,
		}
		return Response(config)
