from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
import hashlib
import secrets

from .own_models import *

# Create your views here.

def index(request):
	#return HttpResponse(template.render(context, request))
	return HttpResponse("Hello, world. You're index.")

def create_user(request):
	username = "testuser"
	password = "testpassword"
	# Generate a secure salt using the secrets module
	password_salt = secrets.token_hex(16)  # Generates a 32-character hexadecimal string
	# Combine the password and salt, then hash them
	hash_input = (password + password_salt).encode('utf-8')
	password_hash = hashlib.sha256(hash_input).hexdigest()
	avatar_url = "https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg"
	language_code = "en"

	user = User(username=username, password_hash=password_hash, password_salt=password_salt, avatar_url=avatar_url, language_code=language_code)
	user.save()
	return HttpResponse("User created successfully.")

def display_first_user(request):
	user = User.objects.first()
	if user:
		template = f"""
		<html>
			<body>
			<h1>User: {user.username}</h1>
			<img src="{user.avatar_url}" alt="User avatar">
			<p>Language: {user.language_code}</p>
			</body>
		</html>
		"""
	else:
		template = """
		<html>
			<body>
			<h1>No user found</h1>
			</body>
		</html>
		"""
	return HttpResponse(template)