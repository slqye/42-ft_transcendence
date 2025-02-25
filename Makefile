# Makefile for briganscendence

# Colors

COLOR_GREEN = \033[0;32m
COLOR_RED = \033[0;31m
COLOR_YELLOW = \033[0;33m
COLOR_RESET = \033[0m

# Rules

NAME = transcendence

MAKEFLAGS += --no-print-directory

all : $(NAME)

$(NAME) : build up

build :
	@docker compose -f ./sources/docker-compose.yml build --no-cache
		
up :
	@docker compose -f ./sources/docker-compose.yml up -d

stop :
	@docker compose -f ./sources/docker-compose.yml stop

start :
	@docker compose -f ./sources/docker-compose.yml start

down :
	@docker compose -f ./sources/docker-compose.yml down

clean : down

fclean : clean
	@docker compose -f ./sources/docker-compose.yml down --rmi all --volumes
	@docker image prune --filter label=is-transcendence=yes --force
	@rm -rf sources/services/django_api/api/migrations

re : clean build up

flush_database :
	@docker exec -it transcendence_django_api python manage.py flush --no-input
	@rm -rf sources/services/django_api/api/migrations

new_database_re :
	@make fclean
	@make build
	@make up

status :
	@echo "${COLOR_GREEN}Containers :${COLOR_RESET}"
	@docker ps -a --filter label=is-transcendence=yes
	@echo "${COLOR_GREEN}Volumes :${COLOR_RESET}"
	@docker volume ls --filter label=is-transcendence=yes
	@echo "${COLOR_GREEN}Networks :${COLOR_RESET}"
	@docker network ls --filter label=is-transcendence=yes
	@echo "${COLOR_GREEN}Images :${COLOR_RESET}"
	@docker image ls --filter label=is-transcendence=yes

.PHONY:	all build up stop start down clean fclean re flush_database new_database_re status