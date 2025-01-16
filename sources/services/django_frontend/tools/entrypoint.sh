#!/bin/sh

#exec gunicorn --bind 0.0.0.0:8080 website.wsgi:application
python manage.py runserver 0.0.0.0:8080