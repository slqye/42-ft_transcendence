#!/bin/sh
set -e

cp frontend/assets/AI.png frontend/assets/user_media/uploads/AI.png
exec gunicorn --bind 0.0.0.0:8080 --workers 3 website.wsgi:application
