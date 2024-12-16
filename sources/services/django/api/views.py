from django.shortcuts import render
from django.http import HttpResponse
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