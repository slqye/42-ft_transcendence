#!/bin/sh

if [ ! -f "/migrations/done" ]; then
	echo "Flushing database..."
	python manage.py flush --no-input

	python manage.py makemigrations api
	python manage.py migrate
	touch /migrations/done
fi

#exec gunicorn --bind 0.0.0.0:8081 website.wsgi:application
python manage.py migrate
python manage.py runserver 0.0.0.0:8081