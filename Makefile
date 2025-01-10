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

clean: down
	@ { docker volume ls --filter label=is-transcendance=yes -q; echo null; } | xargs -r docker volume rm --force

fclean: clean
	@docker compose -f ./sources/docker-compose.yml down --rmi all
	@docker network rm transcendence_network_backend
	@docker image prune --filter label=is-transcendance=yes --force

re:
	@make fclean
	@make build
	@make up

clean_data:
	@rm -rf ${PWD}/data

cre:
	@make fclean
	@make clean_data
	@make build
	@make up

.PHONY:	all re down clean fclean up build clean_data cre

