build-ui:
	docker build . -t location-app_ui

run-dev:
	docker-compose down
	docker-compose up -d --build  

stop-dev:
	docker-compose down

restart-dev:
	docker-compose down
	docker-compose up -d --build
