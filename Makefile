.PHONY: help up down build logs shell-api shell-front artisan composer pnpm test migrate fresh seed renew

# Cores
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

## Ajuda
help: ## Mostra esta ajuda
	@echo ''
	@echo 'Uso:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<comando>${RESET}'
	@echo ''
	@echo 'Comandos:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-15s${RESET} %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## Docker
up: ## Inicia os containers
	docker compose up -d

down: ## Para os containers
	docker compose down

build: ## Reconstroi os containers
	docker compose build --no-cache

restart: ## Reinicia os containers
	docker compose restart

logs: ## Mostra logs de todos os containers
	docker compose logs -f

logs-api: ## Mostra logs da API
	docker compose logs -f api

logs-queue: ## Mostra logs do queue worker
	docker compose logs -f queue

logs-front: ## Mostra logs do frontend
	docker compose logs -f frontend

## Shell
shell-api: ## Acessa o shell do container da API
	docker compose exec api bash

shell-front: ## Acessa o shell do container do frontend
	docker compose exec frontend sh

shell-postgres: ## Acessa o psql do PostgreSQL
	docker compose exec postgres psql -U finassistant -d finassistant

shell-redis: ## Acessa o redis-cli
	docker compose exec redis redis-cli

## Laravel
artisan: ## Executa comando artisan (ex: make artisan cmd="migrate")
	docker compose exec api php artisan $(cmd)

composer: ## Executa comando composer (ex: make composer cmd="require package")
	docker compose exec api composer $(cmd)

migrate: ## Executa migrations
	docker compose exec api php artisan migrate

fresh: ## Recria o banco de dados
	docker compose exec api php artisan migrate:fresh

seed: ## Executa seeders
	docker compose exec api php artisan db:seed

renew: ## Recria o banco com seeders
	docker compose exec api php artisan migrate:fresh --seed

test: ## Executa testes
	docker compose exec api php artisan test

test-filter: ## Executa testes filtrados (ex: make test-filter filter="UserTest")
	docker compose exec api php artisan test --filter=$(filter)

cache-clear: ## Limpa todos os caches do Laravel
	docker compose exec api php artisan cache:clear
	docker compose exec api php artisan config:clear
	docker compose exec api php artisan route:clear
	docker compose exec api php artisan view:clear

## Frontend
pnpm: ## Executa comando pnpm (ex: make pnpm cmd="add axios")
	docker compose exec frontend pnpm $(cmd)

build-front: ## Build do frontend para producao
	docker compose exec frontend pnpm build

lint: ## Executa linter no frontend
	docker compose exec frontend pnpm lint

## Servicos especificos
qdrant-ui: ## Abre UI do Qdrant no navegador
	@echo "Qdrant UI: http://localhost:6333/dashboard"
	@open http://localhost:6333/dashboard 2>/dev/null || xdg-open http://localhost:6333/dashboard 2>/dev/null || echo "Abra manualmente: http://localhost:6333/dashboard"

mailpit: ## Abre Mailpit no navegador
	@echo "Mailpit: http://localhost:8025"
	@open http://localhost:8025 2>/dev/null || xdg-open http://localhost:8025 2>/dev/null || echo "Abra manualmente: http://localhost:8025"

## Setup
setup: ## Configura o projeto pela primeira vez
	@echo "${GREEN}Configurando projeto FinAssistant...${RESET}"
	@if [ ! -f api/.env ]; then cp api/.env.example api/.env; fi
	@if [ ! -f frontend/.env ]; then echo "VITE_API_URL=http://localhost:8000/api/v1" > frontend/.env; fi
	docker compose build
	docker compose up -d
	@echo "${YELLOW}Aguardando servicos iniciarem...${RESET}"
	sleep 10
	docker compose exec api composer install
	docker compose exec api php artisan key:generate
	docker compose exec api php artisan migrate
	@echo ""
	@echo "${GREEN}========================================${RESET}"
	@echo "${GREEN}Projeto configurado com sucesso!${RESET}"
	@echo "${GREEN}========================================${RESET}"
	@echo ""
	@echo "API:      http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo "Mailpit:  http://localhost:8025"
	@echo "Qdrant:   http://localhost:6333/dashboard"
	@echo ""

status: ## Mostra status dos containers
	docker compose ps

clean: ## Remove volumes e limpa tudo (CUIDADO: apaga dados!)
	@echo "${YELLOW}ATENCAO: Isso ira apagar todos os dados!${RESET}"
	@read -p "Continuar? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose down -v
	@echo "${GREEN}Volumes removidos.${RESET}"

## Ngrok
ngrok: ## Inicia tuneis ngrok (frontend + api)
	ngrok start --config ngrok.yml --all

ngrok-front: ## Inicia apenas tunel do frontend
	ngrok http 5180 --hostname=fina.code2.dev

ngrok-api: ## Inicia apenas tunel da API
	ngrok http 8000 --hostname=api-fina.code2.dev

## Desenvolvimento local (sem Docker)
dev-front: ## Inicia frontend em modo desenvolvimento
	cd frontend && pnpm dev --host --port 5180

dev-api: ## Inicia API em modo desenvolvimento
	cd api && php artisan serve --host=0.0.0.0 --port=8000
