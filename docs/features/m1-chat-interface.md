# Chat Interface

> **Status:** Pendente
> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Sprint:** 03
> **Data de criação:** 2026-03-28
> **Última atualização:** 2026-03-28

## Descrição

Interface web simples para testar o RAG de educação financeira. Permite fazer perguntas e visualizar respostas com links para os vídeos fonte. Servirá como ferramenta de validação e debug, podendo ser descontinuada ou mantida como interface administrativa.

## User Story

**Como** desenvolvedor/administrador
**Quero** uma interface web para testar o RAG
**Para** validar o funcionamento antes de integrar com WhatsApp

## Critérios de Aceitação

```gherkin
Funcionalidade: Interface de Chat

  Cenário: Acessar página inicial
    Quando acesso http://localhost:8000/
    Então devo ver o título "FinAssistant"
    E devo ver o subtítulo "Chat de Teste - RAG Educação Financeira"
    E devo ver um campo de input para pergunta
    E devo ver um botão "Enviar"
    E devo ver uma área de mensagens vazia

  Cenário: Fazer pergunta
    Dado que estou na página de chat
    Quando digito "Como economizar dinheiro?" no campo
    E clico em "Enviar"
    Então minha pergunta deve aparecer na área de mensagens
    E devo ver um indicador de loading
    E o campo de input deve ser limpo

  Cenário: Receber resposta
    Dado que enviei uma pergunta
    Quando a resposta é recebida
    Então o indicador de loading deve desaparecer
    E a resposta do assistente deve aparecer
    E a resposta deve conter um link clicável para o vídeo
    E o link deve abrir em nova aba

  Cenário: Múltiplas perguntas
    Dado que já fiz uma pergunta e recebi resposta
    Quando faço outra pergunta
    Então a nova pergunta deve aparecer abaixo da anterior
    E a nova resposta deve aparecer após a nova pergunta
    E o histórico deve ser mantido na sessão

  Cenário: Erro no processamento
    Dado que o RAG está indisponível
    Quando envio uma pergunta
    Então devo ver uma mensagem de erro amigável
    E o botão deve voltar ao estado normal
```

## Mockup

```
┌─────────────────────────────────────────────────────┐
│                   FinAssistant                      │
│       Chat de Teste - RAG Educação Financeira       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  Faça uma pergunta sobre educação           │   │
│  │  financeira...                              │   │
│  │                                             │   │
│  │  ┌───────────────────────────────────────┐  │   │
│  │  │ 👤 Como economizar dinheiro?          │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │                                             │   │
│  │  ┌───────────────────────────────────────┐  │   │
│  │  │ 🤖 Para economizar dinheiro, o Dr.    │  │   │
│  │  │    Equilíbrio recomenda começar pelo  │  │   │
│  │  │    controle de gastos...              │  │   │
│  │  │                                       │  │   │
│  │  │    📺 5 Dicas para Economizar         │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  ┌───────┐ │
│  │ Digite sua pergunta...             │  │Enviar │ │
│  └────────────────────────────────────┘  └───────┘ │
└─────────────────────────────────────────────────────┘
```

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Renderiza a página de chat |
| POST | `/ask` | Processa pergunta e retorna resposta |

### POST /ask

**Request:**
```json
{
  "question": "Como economizar dinheiro?"
}
```

**Response:**
```json
{
  "response": "Para economizar dinheiro...",
  "video_url": "https://youtube.com/watch?v=xxx",
  "video_title": "5 Dicas para Economizar"
}
```

## Componentes da Interface

### Header
- Título: "FinAssistant"
- Subtítulo: "Chat de Teste - RAG Educação Financeira"

### Área de Mensagens
- Container com scroll vertical
- Mensagens do usuário: alinhadas à direita, fundo verde
- Mensagens do assistente: alinhadas à esquerda, fundo cinza
- Link do vídeo: texto verde clicável

### Input
- Campo de texto com placeholder
- Botão "Enviar"
- Submissão via Enter ou click
- Desabilitado durante loading

### Estados
- **Vazio:** Mensagem "Faça uma pergunta sobre educação financeira..."
- **Loading:** Mensagem "⏳ Pensando..." na área do assistente
- **Erro:** Mensagem "❌ Erro ao processar pergunta. Tente novamente."

## Regras de Negócio

1. **[RN01]** - Histórico é mantido apenas na sessão (não persiste)
2. **[RN02]** - Campo de input é limpo após envio
3. **[RN03]** - Botão é desabilitado durante processamento
4. **[RN04]** - Links de vídeo abrem em nova aba
5. **[RN05]** - Interface usa Tailwind CSS via CDN (sem build)

## Dependências

- [x] ProcessQuestion Action funcionando
- [x] CSRF token configurado (Laravel)
- [ ] Tailwind CSS (via CDN)

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `app/Http/Controllers/Chat.php` | Controller do chat |
| `resources/views/chat.blade.php` | View com HTML/CSS/JS |
| `routes/web.php` | Rotas / e /ask |
| `tests/Feature/ChatTest.php` | Testes da interface |

## Tecnologias

- **HTML5** - Estrutura
- **Tailwind CSS** - Estilização (via CDN)
- **JavaScript Vanilla** - Interatividade (fetch API)
- **Blade** - Template engine do Laravel

## Segurança

- CSRF token incluído via meta tag
- Token enviado no header das requisições POST
- Sem autenticação (ferramenta de desenvolvimento)

## Observações

- Interface minimalista, foco em funcionalidade
- Pode ser expandida ou substituída no futuro
- Não é a interface final do produto (M6 terá Vue.js)
- Útil para demonstrações e testes rápidos

---

## Histórico de Aprovações

| Data | Responsável | Tipo | Observação |
|------|-------------|------|------------|
| 2026-03-28 | - | Feature | Documentação inicial criada |
