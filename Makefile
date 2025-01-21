# Makefile for Sauron

NAME = transcendence

MAKEFLAGS += --no-print-directory

all : $(NAME)

$(NAME) : build up

build :
	@mkdir -p ${PWD}/data/database_data
	@mkdir -p ${PWD}/data/database_migrations
	@docker compose -f ./sources/docker-compose.yml build
		
up :
	@docker compose -f ./sources/docker-compose.yml up -d

stop :
	@docker compose -f ./sources/docker-compose.yml stop

start :
	@docker compose -f ./sources/docker-compose.yml start

down :
	@docker compose -f ./sources/docker-compose.yml down

clean : down
	@ { docker volume ls --filter label=is-transcendance=yes -q; echo null; } | xargs -r docker volume rm --force

fclean : clean
	@docker compose -f ./sources/docker-compose.yml down --rmi all
	@docker image prune --filter label=is-transcendance=yes --force

re :
	@make fclean
	@make build
	@make up

flush_database :
	@docker exec -it transcendence_django_api python manage.py flush --no-input

drop_database :
	@docker exec -it transcendence_django_api python manage.py reset_db --noinput
	@rm -f ${PWD}/data/database_migrations/done
	@make fclean

new_database_re :
	@make drop_database
	@make build
	@make up

.PHONY:	all re down clean fclean up build flush_database drop_database new_db_re

