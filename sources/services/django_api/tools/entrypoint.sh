#!/bin/sh

python manage.py makemigrations api
python manage.py migrate

#exec gunicorn --bind 0.0.0.0:8081 website.wsgi:application
python manage.py migrate
python manage.py runserver 0.0.0.0:8081