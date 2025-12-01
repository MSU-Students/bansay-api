.PHONY: up down restart

up:
	sudo service docker start
	sudo service docker status
	sudo compose up -d

down:
	sudo compose down
	sudo service docker stop

restart: down up
