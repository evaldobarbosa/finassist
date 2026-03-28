# RAG Video Assistant

> **Status:** Pendente
> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Sprint:** 02
> **Data de criação:** 2026-03-28
> **Última atualização:** 2026-03-28

## Descrição

Agente de inteligência artificial que responde perguntas sobre educação financeira utilizando RAG (Retrieval-Augmented Generation) com base nas transcrições de vídeos do canal [doutor.equilibrio](https://youtube.com/@doutor.equilibrio).

## User Story

**Como** usuário do FinAssistant
**Quero** fazer perguntas sobre educação financeira via WhatsApp ou interface web
**Para** receber respostas contextualizadas com indicação do vídeo fonte

## Critérios de Aceitação

```gherkin
Funcionalidade: Assistente de Vídeos com RAG

  Cenário: Responder pergunta sobre educação financeira
    Dado que existem transcrições de vídeos no Qdrant
    E o usuário faz a pergunta "Como economizar dinheiro ganhando pouco?"
    Quando o VideoAssistant processa a pergunta
    Então deve retornar uma resposta contextualizada
    E a resposta deve estar baseada no conteúdo dos vídeos
    E deve incluir o link do vídeo fonte mais relevante
    E deve incluir o título do vídeo fonte

  Cenário: Pergunta sem contexto relevante
    Dado que existem transcrições de vídeos no Qdrant
    E o usuário faz a pergunta "Qual a capital da França?"
    Quando o VideoAssistant processa a pergunta
    Então deve retornar uma resposta indicando que não há conteúdo relevante
    E deve sugerir perguntas sobre educação financeira

  Cenário: Múltiplos vídeos relevantes
    Dado que existem vários vídeos sobre "investimentos"
    E o usuário pergunta "Como começar a investir?"
    Quando o VideoAssistant processa a pergunta
    Então deve combinar informações dos vídeos mais relevantes
    E deve indicar o vídeo principal como fonte
```

## Arquitetura

```
Pergunta do usuário
    ↓
VideoAssistant::chat()
    ↓
EmbeddingsProvider::embed(pergunta)
    ↓
QdrantVectorStore::similaritySearch(embedding)
    ↓
Documentos relevantes recuperados (top 5)
    ↓
Prompt = instructions + contexto + pergunta
    ↓
AIProvider::generate(prompt)
    ↓
Resposta contextualizada + vídeo fonte
```

## Componentes

### VideoAssistant

```php
namespace App\Neuron;

class VideoAssistant extends \NeuronAI\RAG
{
    protected function provider(): AIProviderInterface;
    protected function embeddings(): EmbeddingsProviderInterface;
    protected function vectorStore(): VectorStoreInterface;
    public function instructions(): string;
}
```

### ProcessQuestion Action

```php
namespace App\Actions\Rag;

class ProcessQuestion
{
    public function handle(string $question): array;
}
```

**Retorno:**
```php
[
    'response' => 'Texto da resposta...',
    'video_url' => 'https://youtube.com/watch?v=xxx',
    'video_title' => 'Título do Vídeo'
]
```

## Regras de Negócio

1. **[RN01]** - A resposta deve ser baseada exclusivamente no conteúdo das transcrições
2. **[RN02]** - Sempre indicar a fonte (vídeo) da informação
3. **[RN03]** - Respostas devem ser em português brasileiro
4. **[RN04]** - Limitar resposta a ~200 palavras para adequar ao WhatsApp
5. **[RN05]** - Se não houver contexto relevante, informar ao usuário

## Dependências

- [x] Qdrant configurado e rodando
- [x] Collection "videos" criada
- [x] Transcrições ingeridas no Qdrant
- [x] Ollama (dev) ou OpenAI (prod) configurado

## Configuração

### Desenvolvimento (Ollama)

```env
NEURON_PROVIDER=ollama
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

### Produção (OpenAI)

```env
NEURON_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `app/Neuron/VideoAssistant.php` | Agente RAG principal |
| `app/Actions/Rag/ProcessQuestion.php` | Action para processar perguntas |
| `config/neuron.php` | Configurações do Neuron AI |
| `tests/Unit/Neuron/VideoAssistantTest.php` | Testes unitários |
| `tests/Unit/Actions/Rag/ProcessQuestionTest.php` | Testes da action |

## Observações

- O modelo de embedding define a dimensão dos vetores no Qdrant
- `nomic-embed-text` (Ollama): 768 dimensões
- `text-embedding-3-small` (OpenAI): 1536 dimensões
- A collection do Qdrant deve ser criada com a dimensão correta

---

## Histórico de Aprovações

| Data | Responsável | Tipo | Observação |
|------|-------------|------|------------|
| 2026-03-28 | - | Feature | Documentação inicial criada |
