# Classificação Pendente de Transações

## Contexto

Quando uma transação é registrada via áudio (M2) ou imagem/OCR (M3), nem sempre é possível identificar claramente a conta de origem ou destino do pagamento/recebimento.

## Regra

Quando a **conta específica** (origem ou destino) de uma transação **não puder ser determinada automaticamente**, o sistema deve:

1. **Registrar a transação** normalmente, mas associá-la a uma **conta temporária** (`unclassified` ou similar)
2. Marcar a transação com status `pending_classification`
3. Disparar notificações para o usuário classificar posteriormente

## Conta Temporária

- Cada usuário terá uma conta especial `Não Classificado` criada automaticamente
- Transações nesta conta devem ser visualmente destacadas na interface
- O usuário pode mover transações desta conta para a conta correta

## Sistema de Notificações

Quando uma transação for registrada com classificação pendente, **três canais** devem ser acionados:

### 1. Notificação In-App

```json
{
  "type": "pending_classification",
  "transaction_id": "uuid",
  "message": "Nova transação precisa de classificação",
  "details": {
    "amount": 150.00,
    "description": "Transferência recebida",
    "source": "audio"
  },
  "created_at": "2026-03-28T15:30:00Z",
  "read": false
}
```

### 2. WebSocket

Enviar evento em tempo real para clientes conectados:

```json
{
  "event": "transaction.pending_classification",
  "data": {
    "transaction_id": "uuid",
    "amount": 150.00,
    "description": "Transferência recebida",
    "source": "audio"
  }
}
```

**Canal:** `private-user.{user_id}`

### 3. Push Notification (se habilitado)

Se o usuário tiver permitido push notifications:

```json
{
  "title": "Transação precisa de classificação",
  "body": "R$ 150,00 - Transferência recebida",
  "data": {
    "type": "pending_classification",
    "transaction_id": "uuid"
  },
  "click_action": "/transactions/{transaction_id}/classify"
}
```

## Fluxo Completo

```
1. Usuário envia áudio/imagem via WhatsApp
2. Sistema extrai dados da transação
3. Sistema tenta identificar conta de origem/destino
4. SE conta não identificada:
   a. Registrar em conta "Não Classificado"
   b. Marcar status = pending_classification
   c. Criar notificação in-app
   d. Enviar evento WebSocket
   e. Enviar push notification (se permitido)
5. Usuário recebe confirmação via WhatsApp com aviso:
   "Transação registrada. Conta não identificada - classifique no app."
6. Usuário acessa interface e classifica a transação
7. Sistema move transação para conta correta
8. Marca notificação como resolvida
```

## Interface (M6)

### Badge de Pendências

- Exibir badge no menu com contagem de transações pendentes
- Destacar transações na conta "Não Classificado"

### Tela de Classificação

- Lista de transações pendentes
- Para cada transação:
  - Detalhes extraídos (valor, descrição, data)
  - Origem (áudio/imagem)
  - Seletor de conta de destino
  - Botão "Classificar"

### Classificação Rápida

- Swipe para classificar (mobile)
- Dropdown de conta na listagem

## Modelo de Dados

### Tabela: transactions

```
- status: enum('confirmed', 'pending', 'pending_classification')
- source: enum('manual', 'audio', 'image', 'recurring')
- original_data: json (dados brutos extraídos)
```

### Tabela: notifications

```
- id: uuid
- user_id: uuid
- type: string ('pending_classification', 'reminder', etc.)
- notifiable_type: string ('App\Models\Transaction')
- notifiable_id: uuid
- data: json
- read_at: timestamp nullable
- created_at: timestamp
```

### Tabela: user_settings

```
- push_notifications_enabled: boolean
- push_token: string nullable
- websocket_enabled: boolean (default true)
```

## Milestones Afetados

- **M2 (Áudio):** Implementar lógica de detecção de conta + fallback
- **M3 (Imagem):** Implementar lógica de detecção de conta + fallback
- **M4 (API):** Criar conta temporária, modelo de notificações, endpoints
- **M5 (Integração):** Orquestrar fluxo completo com notificações
- **M6 (Frontend):** Interface de classificação + WebSocket + Push

## Critérios de Aceitação

- [ ] Transações sem conta identificada vão para "Não Classificado"
- [ ] Notificação in-app criada automaticamente
- [ ] Evento WebSocket enviado em tempo real
- [ ] Push notification enviada (se habilitado)
- [ ] Usuário consegue classificar via interface
- [ ] Após classificação, transação move para conta correta
- [ ] Notificação marcada como resolvida após classificação
