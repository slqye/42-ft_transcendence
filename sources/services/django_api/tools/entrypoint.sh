#!/bin/sh

exec gunicorn --bind 0.0.0.0:8081 website.wsgi:application

python manage.py makemigrations
python manage.py migrate