# Webhook Message

> **Status:** Pendente
> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Sprint:** 03
> **Data de criação:** 2026-03-28
> **Última atualização:** 2026-03-28

## Descrição

Endpoint webhook que recebe mensagens do WhatsApp (via aplicação Go com whatsmeow) e retorna respostas do RAG. No M1, suporta apenas mensagens de texto. Suporte a áudio e imagem será adicionado nos milestones M2 e M3.

## User Story

**Como** aplicação de integração WhatsApp
**Quero** enviar mensagens dos usuários para um endpoint
**Para** receber respostas do assistente de educação financeira

## Critérios de Aceitação

```gherkin
Funcionalidade: Webhook para mensagens WhatsApp

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
    E o JSON de resposta deve conter:
      | campo       | tipo   | obrigatório |
      | phone       | string | sim         |
      | response    | string | sim         |
      | video_url   | string | não         |
      | video_title | string | não         |

  Cenário: Receber mensagem de áudio (não suportado em M1)
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999",
        "message": "base64_do_audio...",
        "type": "audio"
      }
      """
    Então devo receber status 200
    E o JSON deve conter:
      | campo    | valor                                   |
      | phone    | 5511999999999                           |
      | response | Tipo de mensagem não suportado ainda.   |
      | error    | true                                    |

  Cenário: Receber mensagem de imagem (não suportado em M1)
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999",
        "message": "base64_da_imagem...",
        "type": "image"
      }
      """
    Então devo receber status 200
    E o JSON deve indicar tipo não suportado

  Cenário: Payload inválido - campo ausente
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999"
      }
      """
    Então devo receber status 422
    E o JSON deve conter erros de validação para "message" e "type"

  Cenário: Payload inválido - type inválido
    Quando envio POST para /webhook/message com:
      """
      {
        "phone": "5511999999999",
        "message": "teste",
        "type": "video"
      }
      """
    Então devo receber status 422
    E o JSON deve conter erro de validação para "type"
```

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/webhook/message` | Recebe mensagem e retorna resposta |

### Request

```http
POST /webhook/message
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Como economizar dinheiro?",
  "type": "text"
}
```

### Response (sucesso)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "phone": "5511999999999",
  "response": "Para economizar dinheiro, o Dr. Equilíbrio recomenda...",
  "video_url": "https://youtube.com/watch?v=xxx",
  "video_title": "5 Dicas para Economizar Dinheiro"
}
```

### Response (tipo não suportado)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "phone": "5511999999999",
  "response": "Tipo de mensagem não suportado ainda.",
  "error": true
}
```

### Response (erro de validação)

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "message": "The given data was invalid.",
  "errors": {
    "message": ["The message field is required."],
    "type": ["The type field is required."]
  }
}
```

## Validação

| Campo | Regras |
|-------|--------|
| phone | required, string |
| message | required, string |
| type | required, in:text,audio,image |

## Fluxo

```
App Go (whatsmeow)
    ↓
POST /webhook/message
    ↓
Webhook/Message Controller
    ↓
Validação do payload
    ↓
type == "text" ?
    ├── Sim → ProcessMessage Action
    │           ↓
    │         ProcessQuestion Action
    │           ↓
    │         VideoAssistant (RAG)
    │           ↓
    │         Resposta com vídeo
    │
    └── Não → Retornar erro "não suportado"
    ↓
JSON Response
    ↓
App Go (whatsmeow)
    ↓
WhatsApp (usuário)
```

## Regras de Negócio

1. **[RN01]** - Apenas type=text é processado no M1
2. **[RN02]** - type=audio será implementado no M2
3. **[RN03]** - type=image será implementado no M3
4. **[RN04]** - Resposta sempre inclui o phone para roteamento
5. **[RN05]** - Erros de validação retornam 422
6. **[RN06]** - Tipos não suportados retornam 200 com flag error=true

## Dependências

- [x] VideoAssistant configurado e funcionando
- [x] Transcrições ingeridas no Qdrant
- [ ] Aplicação Go (whatsmeow) configurada para chamar o webhook

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `app/Http/Controllers/Webhook/Message.php` | Controller do webhook |
| `app/Actions/Webhook/ProcessMessage.php` | Action para processar mensagem |
| `routes/api.php` | Rota do webhook |
| `tests/Feature/Webhook/MessageTest.php` | Testes do endpoint |

## Logging (opcional)

Salvar requisições em `webhook_logs` para debug:

```php
WebhookLog::create([
    'phone' => $request->phone,
    'message_type' => $request->type,
    'request_payload' => $request->all(),
    'response_payload' => $response,
    'processed_at' => now(),
]);
```

## Segurança

- **M1:** Sem autenticação (ambiente de desenvolvimento)
- **M4+:** Adicionar autenticação via token/API key

## Observações

- O endpoint usa rota de API (`routes/api.php`), não web
- Não requer CSRF token
- A aplicação Go é responsável por enviar a resposta de volta ao WhatsApp
- Timeout padrão do request pode precisar de ajuste para perguntas complexas

---

## Histórico de Aprovações

| Data | Responsável | Tipo | Observação |
|------|-------------|------|------------|
| 2026-03-28 | - | Feature | Documentação inicial criada |
