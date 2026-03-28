# M1 Sprint 03 - Endpoints + Interface

> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Status:** Pendente
> **Dependência:** M1 Sprint 02
> **Data de criação:** 2026-03-28

## Objetivo

Expor o RAG via webhook para integração com WhatsApp e criar interface web para testes. Finalizar com testes automatizados e validação end-to-end.

## Entrega Esperada

Ao final desta sprint (e do M1):
- Webhook `/webhook/message` funcionando
- Interface de chat em `http://localhost:8000`
- Fazer pergunta e receber resposta com link do vídeo
- Testes automatizados passando

---

## Backlog da Sprint

### Webhook

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S3-01 | Criar `app/Http/Controllers/Webhook/Message.php` | P0 | [ ] |
| S3-02 | Criar `app/Actions/Webhook/ProcessMessage.php` | P0 | [ ] |
| S3-03 | Adicionar rota POST `/webhook/message` | P0 | [ ] |
| S3-04 | Implementar validação de payload | P0 | [ ] |
| S3-05 | Implementar tratamento de type=text | P0 | [ ] |
| S3-06 | Retornar erro amigável para type=audio/image | P1 | [ ] |
| S3-07 | Implementar logging em webhook_logs | P2 | [ ] |

### Interface de Chat

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S3-08 | Criar `app/Http/Controllers/Chat.php` | P0 | [ ] |
| S3-09 | Criar `resources/views/chat.blade.php` | P0 | [ ] |
| S3-10 | Adicionar rota GET `/` para chat | P0 | [ ] |
| S3-11 | Adicionar rota POST `/ask` para perguntas | P0 | [ ] |
| S3-12 | Implementar campo de input | P0 | [ ] |
| S3-13 | Implementar área de mensagens | P0 | [ ] |
| S3-14 | Implementar indicador de loading | P1 | [ ] |
| S3-15 | Implementar exibição de link do vídeo | P0 | [ ] |
| S3-16 | Estilizar com Tailwind CSS (CDN) | P1 | [ ] |

### Testes Feature

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S3-17 | Criar `tests/Feature/Webhook/MessageTest.php` | P0 | [ ] |
| S3-18 | Testar POST com type=text válido | P0 | [ ] |
| S3-19 | Testar POST com type=audio (erro esperado) | P1 | [ ] |
| S3-20 | Testar POST com payload inválido | P1 | [ ] |
| S3-21 | Criar `tests/Feature/ChatTest.php` | P1 | [ ] |
| S3-22 | Testar GET / retorna view | P1 | [ ] |
| S3-23 | Testar POST /ask com pergunta válida | P1 | [ ] |

### Documentação

| ID | Tarefa | Prioridade | Status |
|----|--------|------------|--------|
| S3-24 | Atualizar README.md do projeto api/ | P1 | [ ] |
| S3-25 | Documentar endpoints disponíveis | P1 | [ ] |
| S3-26 | Documentar variáveis de ambiente | P1 | [ ] |
| S3-27 | Registrar aprendizados no CHANGELOG | P2 | [ ] |

---

## Critérios de Aceitação

```gherkin
Funcionalidade: Webhook para WhatsApp

  Cenário: Receber pergunta de texto
    Dado que o RAG está funcionando
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999",
        "message": "Como economizar dinheiro?",
        "type": "text"
      }
      """
    Então devo receber status 200
    E o JSON deve conter:
      | campo       | presente |
      | phone       | sim      |
      | response    | sim      |
      | video_url   | sim      |
      | video_title | sim      |

  Cenário: Receber áudio (não suportado em M1)
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999",
        "message": "base64...",
        "type": "audio"
      }
      """
    Então devo receber status 200
    E o JSON deve conter:
      | campo    | valor                              |
      | error    | true                               |
      | response | Tipo de mensagem não suportado ainda. |

  Cenário: Payload inválido
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999"
      }
      """
    Então devo receber status 422
    E o JSON deve conter erros de validação

Funcionalidade: Interface de Chat

  Cenário: Acessar página inicial
    Quando acesso http://localhost:8000/
    Então devo ver o título "FinAssistant"
    E devo ver um campo de input para pergunta
    E devo ver um botão "Enviar"

  Cenário: Fazer pergunta via interface
    Dado que estou na página de chat
    Quando digito "Como economizar dinheiro?" no campo
    E clico em "Enviar"
    Então devo ver minha pergunta na área de mensagens
    E devo ver um indicador de loading
    E após alguns segundos devo ver a resposta do assistente
    E a resposta deve conter um link para vídeo do YouTube
```

---

## Arquivos a Criar

```
api/app/
├── Http/
│   └── Controllers/
│       ├── Webhook/
│       │   └── Message.php
│       └── Chat.php
└── Actions/
    └── Webhook/
        └── ProcessMessage.php

api/resources/
└── views/
    └── chat.blade.php

api/routes/
├── web.php (adicionar rotas / e /ask)
└── api.php (adicionar rota /webhook/message)

api/tests/
└── Feature/
    ├── Webhook/
    │   └── MessageTest.php
    └── ChatTest.php
```

---

## Validação

### Teste do Webhook via curl

```bash
# Pergunta válida
curl -X POST http://localhost:8000/webhook/message \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Como economizar dinheiro?",
    "type": "text"
  }' | jq

# Resposta esperada:
# {
#   "phone": "5511999999999",
#   "response": "Para economizar dinheiro, o Dr. Equilíbrio recomenda...",
#   "video_url": "https://youtube.com/watch?v=xxx",
#   "video_title": "5 Dicas para Economizar"
# }
```

### Teste da Interface Web

1. Acessar http://localhost:8000
2. Digitar "Como investir com pouco dinheiro?"
3. Clicar em Enviar
4. Verificar resposta com link do vídeo
5. Clicar no link e verificar se abre o YouTube

### Testes Automatizados

```bash
docker compose exec app php artisan test

# Ou específico:
docker compose exec app php artisan test --filter=MessageTest
docker compose exec app php artisan test --filter=ChatTest
```

---

## Checklist de Conclusão do M1

Ao concluir esta sprint, validar:

- [ ] `docker compose up` funciona
- [ ] Migrations executam sem erro
- [ ] `php artisan transcripts:ingest` ingere transcrições
- [ ] Qdrant tem pontos na collection videos
- [ ] `curl POST /webhook/message` retorna resposta do RAG
- [ ] Interface web em localhost:8000 funciona
- [ ] Perguntas são respondidas com link do vídeo
- [ ] Testes automatizados passam
- [ ] Documentação atualizada

---

## Observações

- A interface web usa Tailwind via CDN (não precisa de build)
- CSRF token necessário para POST /ask (incluído na view)
- Webhook não usa autenticação nesta fase (será adicionado em M4)
- Logging de webhook é opcional mas recomendado para debug
