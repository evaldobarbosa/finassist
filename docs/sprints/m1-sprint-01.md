# M1 Sprint 01 - Infraestrutura

> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Status:** Pendente
> **Data de criação:** 2026-03-28

## Objetivo

Configurar toda a infraestrutura necessária para o desenvolvimento do RAG: projeto Laravel, Docker, banco de dados e Qdrant.

## Entrega Esperada

Ao final desta sprint:
- `docker compose up` sobe todos os serviços
- Migrations executam sem erro
- Qdrant acessível em localhost:6333
- Estrutura base do projeto pronta

---

## Backlog da Sprint

### Setup Inicial

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-01 | Adicionar `api/` e `front/` no .gitignore do projeto pai | P0 | [ ] |
| S1-02 | Criar pasta `api/` e instalar Laravel 12 | P0 | [ ] |
| S1-03 | Executar `git init -b main` na pasta api/ | P0 | [ ] |
| S1-04 | Criar `.gitignore` adequado para Laravel | P0 | [ ] |

### Docker

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-05 | Criar `docker-compose.yml` com serviços | P0 | [ ] |
| S1-06 | Configurar serviço `app` (PHP 8.3-fpm) | P0 | [ ] |
| S1-07 | Configurar serviço `nginx` | P0 | [ ] |
| S1-08 | Configurar serviço `postgres` (PostgreSQL 16) | P0 | [ ] |
| S1-09 | Configurar serviço `qdrant` | P0 | [ ] |
| S1-10 | Configurar serviço `redis` | P1 | [ ] |
| S1-11 | Criar `Dockerfile` para o app PHP | P0 | [ ] |
| S1-12 | Criar `docker/nginx/default.conf` | P0 | [ ] |
| S1-13 | Testar `docker compose up` | P0 | [ ] |

### Configuração Laravel

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-14 | Configurar `.env` com variáveis de banco | P0 | [ ] |
| S1-15 | Criar `.env.example` | P0 | [ ] |
| S1-16 | Configurar `config/database.php` para PostgreSQL | P0 | [ ] |
| S1-17 | Criar `config/neuron.php` (estrutura inicial) | P1 | [ ] |

### Migrations

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-18 | Criar migration `create_videos_table` | P0 | [ ] |
| S1-19 | Criar migration `create_webhook_logs_table` | P1 | [ ] |
| S1-20 | Executar migrations | P0 | [ ] |

### Models

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-21 | Criar `app/Models/Video.php` | P0 | [ ] |
| S1-22 | Criar `app/Models/WebhookLog.php` | P1 | [ ] |

### Qdrant

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S1-23 | Criar command `qdrant:create-collection` | P0 | [ ] |
| S1-24 | Criar command `qdrant:reset-collection` | P1 | [ ] |
| S1-25 | Testar acesso ao Qdrant via curl | P0 | [ ] |

---

## Critérios de Aceitação

```gherkin
Funcionalidade: Infraestrutura do projeto

  Cenário: Subir ambiente Docker
    Dado que estou na pasta api/
    Quando executo "docker compose up -d"
    Então todos os containers devem iniciar sem erro
    E o app deve estar acessível em http://localhost:8000
    E o Qdrant deve estar acessível em http://localhost:6333

  Cenário: Executar migrations
    Dado que os containers estão rodando
    Quando executo "docker compose exec app php artisan migrate"
    Então as tabelas videos e webhook_logs devem ser criadas
    E não deve haver erros de conexão

  Cenário: Criar collection no Qdrant
    Dado que o Qdrant está rodando
    Quando executo "docker compose exec app php artisan qdrant:create-collection"
    Então a collection "videos" deve ser criada
    E deve aceitar vetores de dimensão configurada
```

---

## Arquivos a Criar

```
api/
├── docker-compose.yml
├── Dockerfile
├── docker/
│   └── nginx/
│       └── default.conf
├── .env.example
├── config/
│   └── neuron.php
├── database/
│   └── migrations/
│       ├── xxxx_create_videos_table.php
│       └── xxxx_create_webhook_logs_table.php
├── app/
│   ├── Models/
│   │   ├── Video.php
│   │   └── WebhookLog.php
│   └── Console/
│       └── Commands/
│           ├── CreateQdrantCollection.php
│           └── ResetQdrantCollection.php
```

---

## Validação

```bash
# 1. Subir containers
cd api
docker compose up -d

# 2. Verificar serviços
docker compose ps

# 3. Executar migrations
docker compose exec app php artisan migrate

# 4. Criar collection Qdrant
docker compose exec app php artisan qdrant:create-collection

# 5. Verificar Qdrant
curl http://localhost:6333/collections | jq

# 6. Verificar app
curl http://localhost:8000
```

---

## Observações

- Ollama roda no host, não em container (usa `host.docker.internal`)
- PostgreSQL usado apenas para metadados, não para vetores
- Redis será usado para cache e filas em sprints futuras
