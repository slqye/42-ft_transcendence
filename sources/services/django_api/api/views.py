import os
import requests

from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse, Http404

from .models import User, Match
from .serializers import UserSerializer, MatchSerializer

from django.contrib.auth import get_user_model, login

from rest_framework import generics, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import redirect

# Create your views here.

User = get_user_model()

class RegisterUser(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.AllowAny]

# We override the post method to return the token more explicitly if needed
class CustomAuthToken(ObtainAuthToken):
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		response = super().post(request, *args, **kwargs)
		# response.data contains 'token' if success
		return response


class UserList(generics.ListCreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

class CurrentUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
			'password': user.password,
            'email': user.email,
            'avatar_url': getattr(user, 'avatar_url', None),
            'language_code': getattr(user, 'language_code', 'en'),
        })

class MatchList(generics.ListCreateAPIView):
	queryset = Match.objects.all()
	serializer_class = MatchSerializer
	permission_classes = [permissions.AllowAny]

class MatchDetail(generics.RetrieveDestroyAPIView):
	queryset = Match.objects.all()
	serializer_class = MatchSerializer
	permission_classes = [permissions.AllowAny]

def index(request, path=None):
	return HttpResponse("")

class OAuthCallbackView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		code = request.GET.get('code')
		if not code:
			return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

		# Exchange code for access token
		token_response = requests.post(
			'https://api.intra.42.fr/oauth/token',
			data={
				'grant_type': 'authorization_code',
				'client_id': os.environ['API_42_UID'],
				'client_secret': os.environ['API_42_SECRET'],
				'code': code,
				'redirect_uri': os.environ['API_42_REDIRECT_URI'],
			}
		)
		
		if token_response.status_code != 200:
			return Response({"error": "Failed to obtain access token"}, status=status.HTTP_400_BAD_REQUEST)

		access_token = token_response.json().get('access_token')

		# Fetch user information
		user_response = requests.get(
			'https://api.intra.42.fr/v2/me',
			headers={'Authorization': f'Bearer {access_token}'}
		)
		
		if user_response.status_code != 200:
			return Response({"error": "Failed to fetch user information"}, status=status.HTTP_400_BAD_REQUEST)

		user_data = user_response.json()
		username = user_data.get('login')

		# Create or retrieve the user
		user, created = User.objects.get_or_create(username=username)
		if created:
			user.email = user_data.get('email')
			user.avatar_url = user_data.get('image', {}).get('link')
			user.save()

		# Log the user in and create a token
		login(request, user)
		token, _ = Token.objects.get_or_create(user=user)

		# Redirect to frontend with token
		return redirect(f"{settings.MAIN_URL}/?token={token.key}")

class FrontendConfigView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		config = {
			"API_42_UID": settings.API_42_UID,
			"API_42_REDIRECT_URI": settings.API_42_REDIRECT_URI,
		}
		return Response(config)
