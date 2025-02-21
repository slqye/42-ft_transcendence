import os

from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse, Http404
from django.shortcuts import redirect

def index(request, path=None):
	content = ""
	with open("frontend/index.html", "r") as file:
		content = file.read()
	if (path and path != "home"):
		return redirect(f"{settings.MAIN_URL}/home")
	else:
		return HttpResponse(content)

# Define the base path to your frontend files
FRONTEND_ROOT = os.path.join(settings.BASE_DIR, "frontend")

def frontend(request, path):
	# Ensure the file exists in the frontend directory
	file_path = os.path.join(FRONTEND_ROOT, path)

	if os.path.isfile(file_path):
		# Serve the file using Django's built-in static file serving
		return serve(request, path, document_root=FRONTEND_ROOT)

	raise Http404("File not found.")