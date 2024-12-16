import os
from django.shortcuts import render
from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse, Http404
from rest_framework import generics
from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserList(generics.ListCreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer

def index(request):
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