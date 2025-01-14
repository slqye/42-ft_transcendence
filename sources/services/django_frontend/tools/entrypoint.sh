#!/bin/sh

if [ ! -f "./migrations/done" ]; then
	python manage.py flush --no-input
	touch ./migrations/done
fi

python manage.py makemigrations api
python manage.py migrate

#exec gunicorn --bind 0.0.0.0:8080 website.wsgi:application
python manage.py runserver 0.0.0.0:8080