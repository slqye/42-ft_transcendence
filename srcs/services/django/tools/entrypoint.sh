#!/bin/sh

if [ ! -f "./migrations/done" ]; then
	python manage.py flush --no-input
	python manage.py makemigrations main_app
	python manage.py migrate
	touch ./migrations/done
fi

#exec gunicorn --bind 0.0.0.0:8080 website.wsgi:application
python manage.py runserver 0.0.0.0:8080