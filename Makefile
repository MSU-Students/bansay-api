.PHONY: up down restart

up:
	sudo service docker start
	sudo service docker status
	sudo docker compose up -d

down:
	sudo docker compose down
	sudo service docker stop

restart: down up
