import os

from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse, Http404

from .models import User, Match
from .serializers import UserSerializer, MatchSerializer

from django.contrib.auth import get_user_model

from rest_framework import generics, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

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
	content = ""
	with open("frontend/index.html", "r") as file:
		content = file.read()
	return HttpResponse(content)

# Define the base path to your frontend files
FRONTEND_ROOT = os.path.join(settings.BASE_DIR, "frontend")

def frontend(request, path):
    # Ensure the file exists in the frontend directory
    file_path = os.path.join(FRONTEND_ROOT, path)
    print(file_path)

    if os.path.isfile(file_path):
        # Serve the file using Django's built-in static file serving
        return serve(request, path, document_root=FRONTEND_ROOT)

    raise Http404("File not found.")