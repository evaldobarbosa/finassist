# M1 Sprint 02 - RAG Core

> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Status:** Pendente
> **Dependência:** M1 Sprint 01
> **Data de criação:** 2026-03-28

## Objetivo

Implementar o núcleo do sistema RAG: configurar Neuron AI, criar o agente VideoAssistant, implementar ingestão de transcrições e validar funcionamento via tinker.

## Entrega Esperada

Ao final desta sprint:
- Transcrições ingeridas no Qdrant
- Fazer pergunta via `php artisan tinker` e receber resposta do RAG
- Ingestão incremental funcionando

---

## Backlog da Sprint

### Neuron AI

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-01 | Instalar `neuron-ai/neuron-ai` via composer | P0 | [ ] |
| S2-02 | Configurar `config/neuron.php` completo | P0 | [ ] |
| S2-03 | Adicionar variáveis de ambiente no `.env` | P0 | [ ] |

### Ollama (Desenvolvimento Local)

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-04 | Documentar instalação do Ollama | P1 | [ ] |
| S2-05 | Baixar modelo `llama3.2` | P0 | [ ] |
| S2-06 | Baixar modelo `nomic-embed-text` | P0 | [ ] |
| S2-07 | Testar conexão Ollama via curl | P0 | [ ] |

### VideoAssistant (Agente RAG)

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-08 | Criar pasta `app/Neuron/` | P0 | [ ] |
| S2-09 | Criar `VideoAssistant.php` estendendo RAG | P0 | [ ] |
| S2-10 | Configurar `provider()` com Ollama | P0 | [ ] |
| S2-11 | Configurar `embeddings()` com OllamaEmbeddings | P0 | [ ] |
| S2-12 | Configurar `vectorStore()` com QdrantVectorStore | P0 | [ ] |
| S2-13 | Definir `instructions()` para educação financeira | P0 | [ ] |

### Command de Ingestão

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-14 | Criar `app/Console/Commands/IngestTranscripts.php` | P0 | [ ] |
| S2-15 | Implementar listagem de arquivos `.txt` | P0 | [ ] |
| S2-16 | Implementar verificação de duplicatas (PostgreSQL) | P0 | [ ] |
| S2-17 | Implementar ingestão via Neuron `addDocuments()` | P0 | [ ] |
| S2-18 | Implementar flag `--fresh` (reset completo) | P1 | [ ] |
| S2-19 | Implementar flag `--video` + `--force` | P1 | [ ] |
| S2-20 | Implementar `deleteVideoChunks()` para Qdrant | P1 | [ ] |
| S2-21 | Adicionar output de progresso (tabela final) | P2 | [ ] |

### Action ProcessQuestion

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-22 | Criar `app/Actions/Rag/ProcessQuestion.php` | P0 | [ ] |
| S2-23 | Implementar chamada ao VideoAssistant | P0 | [ ] |
| S2-24 | Extrair metadados do vídeo fonte | P0 | [ ] |
| S2-25 | Retornar estrutura com response, video_url, video_title | P0 | [ ] |

### Testes Unitários

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S2-26 | Criar `tests/Unit/Neuron/VideoAssistantTest.php` | P1 | [ ] |
| S2-27 | Criar `tests/Unit/Actions/Rag/ProcessQuestionTest.php` | P1 | [ ] |

---

## Critérios de Aceitação

```gherkin
Funcionalidade: Ingestão de transcrições

  Cenário: Primeira ingestão
    Dado que a collection "videos" está vazia
    E existem 6 arquivos em Traducoes/output/
    Quando executo "php artisan transcripts:ingest"
    Então 6 registros devem ser criados na tabela videos
    E os chunks devem estar no Qdrant
    E a saída deve mostrar "6 novos, 0 atualizados, 0 pulados"

  Cenário: Ingestão incremental
    Dado que já existem 6 vídeos ingeridos
    E adiciono 2 novos arquivos em Traducoes/output/
    Quando executo "php artisan transcripts:ingest"
    Então apenas 2 novos registros devem ser criados
    E a saída deve mostrar "2 novos, 0 atualizados, 6 pulados"

  Cenário: Atualizar vídeo específico
    Dado que o vídeo "abc123" já foi ingerido
    Quando executo "php artisan transcripts:ingest --video=abc123 --force"
    Então os chunks antigos de "abc123" devem ser deletados
    E os novos chunks devem ser ingeridos
    E a saída deve mostrar "0 novos, 1 atualizados, 0 pulados"

Funcionalidade: RAG funcionando

  Cenário: Fazer pergunta via tinker
    Dado que existem transcrições no Qdrant
    Quando executo no tinker:
      """
      use App\Actions\Rag\ProcessQuestion;
      (new ProcessQuestion)->handle('Como economizar dinheiro?');
      """
    Então devo receber um array com:
      | campo       | tipo   |
      | response    | string |
      | video_url   | string |
      | video_title | string |
```

---

## Arquivos a Criar

```
api/app/
├── Neuron/
│   └── VideoAssistant.php
├── Actions/
│   └── Rag/
│       └── ProcessQuestion.php
└── Console/
    └── Commands/
        └── IngestTranscripts.php

api/tests/
└── Unit/
    ├── Neuron/
    │   └── VideoAssistantTest.php
    └── Actions/
        └── Rag/
            └── ProcessQuestionTest.php
```

---

## Validação

```bash
# 1. Verificar Ollama
curl http://localhost:11434/api/tags | jq

# 2. Ingerir transcrições
docker compose exec app php artisan transcripts:ingest

# 3. Verificar PostgreSQL
docker compose exec app php artisan tinker
>>> Video::count()
# Deve retornar 6 (ou quantidade de arquivos)

# 4. Verificar Qdrant
curl http://localhost:6333/collections/videos | jq '.result.points_count'
# Deve retornar número > 0

# 5. Testar RAG
docker compose exec app php artisan tinker
>>> use App\Actions\Rag\ProcessQuestion;
>>> $result = (new ProcessQuestion)->handle('Como economizar dinheiro?');
>>> $result['response']
# Deve retornar resposta contextualizada
>>> $result['video_url']
# Deve retornar URL do YouTube
```

---

## Observações

- Ollama deve estar rodando no host antes de testar
- Primeira ingestão pode demorar (geração de embeddings)
- Dimensão do vetor depende do modelo de embedding:
  - `nomic-embed-text`: 768
  - `mxbai-embed-large`: 1024
  - OpenAI `text-embedding-3-small`: 1536
- Ajustar `config/neuron.php` com a dimensão correta
