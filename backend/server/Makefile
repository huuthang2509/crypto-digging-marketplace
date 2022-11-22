args=$(filter-out $@,$(MAKECMDGOALS))
PROJECT=crypto-digging

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev: ## start server
	cd ./services/shared && npm run build
	docker compose -f docker-compose.yaml -f docker-compose.local.yaml -p $(PROJECT) up -d

dev-down: ## stop server
	docker compose -p $(PROJECT) down

dev-build: ## start server
	docker compose -p $(PROJECT) build $(args)

logs: ## log container
	docker compose -p $(PROJECT) logs -f $(args)

restart: ## restart container
	docker compose -p $(PROJECT) restart $(args)

clean: ## clean project
	docker compose -p $(PROJECT) down --remove-orphans -v

package: ## init migrate and database
	./scripts/package.sh

build: ## build image
	./scripts/build-image.sh $(args)

bootstrap: ## init migrate and database
	./scripts/bootstrap.sh

migrate: ## migration
	./scripts/migrate.sh

seed: ## seed data
	./scripts/seed.sh

## Deployment
deploy-dev: ## deploy-dev
	cd ./services/shared && npm run build
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -p $(PROJECT) up -d
	./scripts/migrate.sh
