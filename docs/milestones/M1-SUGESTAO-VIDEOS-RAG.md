# Plano M1 - Sugestão de Vídeos (RAG)

## Sprints

| Sprint | Foco | Status | Documento |
|--------|------|--------|-----------|
| Sprint 01 | Infraestrutura | Pendente | [m1-sprint-01.md](../sprints/m1-sprint-01.md) |
| Sprint 02 | RAG Core | Pendente | [m1-sprint-02.md](../sprints/m1-sprint-02.md) |
| Sprint 03 | Endpoints + Interface | Pendente | [m1-sprint-03.md](../sprints/m1-sprint-03.md) |

---

## Decisões do Usuário

- **Local do backend:** Pasta `api/` (subpasta do projeto atual)
- **Repositório:** Separado (git init na pasta api/)
- **Branch principal:** `main`
- **Ignorar no projeto pai:** `api/` e `front/` no .gitignore
- **Vector Store:** Qdrant (em vez de pgvector) - driver nativo no Neuron AI
- **Framework de Agentes:** Neuron AI (neuron-ai/neuron-ai)

## Visão Geral

Implementar endpoint webhook que recebe perguntas sobre educação financeira via WhatsApp e retorna sugestões de vídeos do canal doutor.equilibrio usando RAG (Retrieval-Augmented Generation).

## Arquitetura

```
WhatsApp → App Go (whatsmeow) → POST /webhook/message → RAG → Resposta → App Go → WhatsApp
```

## Estrutura de Pastas

```
FinAssistant/
├── api/                    # Backend Laravel (repositório separado)
│   ├── app/
│   │   ├── Actions/        # Lógica de negócio
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Webhook/
│   │   │           └── Message.php
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── docker-compose.yml
│   └── ...
├── front/                  # Frontend Vue (futuro - M6)
├── Traducoes/              # Scripts de transcrição (existente)
└── docs/                   # Documentação (existente)
```

---

## Fase 1: Setup Inicial

### 1.1 Configurar .gitignore do projeto pai

Adicionar ao `.gitignore` na raiz:
```
api/
front/
```

### 1.2 Criar projeto Laravel

```bash
cd /Users/evaldobarbosa/Projetos/Code2/FinAssistant
mkdir api
cd api
composer create-project laravel/laravel:^12.0 .
git init -b main
```

### 1.3 Docker Compose

Criar `api/docker-compose.yml`:
- **app**: PHP 8.3 + Laravel
- **postgres**: PostgreSQL 16 (dados da aplicação)
- **qdrant**: Qdrant (vector store para RAG)
- **redis**: Cache e filas

### 1.4 Configurar Qdrant

Qdrant roda em container separado. Configuração no docker-compose:

```yaml
qdrant:
  image: qdrant/qdrant:latest
  ports:
    - "6333:6333"
    - "6334:6334"
  volumes:
    - qdrant_data:/qdrant/storage
  environment:
    - QDRANT__SERVICE__GRPC_PORT=6334
```

Criar collection via API ou no boot da aplicação:
```bash
curl -X PUT http://localhost:6333/collections/videos \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

---

## Fase 2: Modelo de Dados

### 2.1 Tabelas PostgreSQL

**videos** - Metadados dos vídeos
```
- id (uuid)
- youtube_id (string, unique)
- title (string)
- url (string)
- channel (string)
- duration (integer, nullable)
- created_at, updated_at
```

**webhook_logs** - Log de requisições (opcional)
```
- id (uuid)
- phone (string)
- message_type (string)
- request_payload (json)
- response_payload (json)
- processed_at (timestamp)
- created_at
```

### 2.2 Qdrant Collection

**videos** - Collection no Qdrant para chunks com embeddings

```json
{
  "collection_name": "videos",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  }
}
```

**Estrutura de cada ponto (point):**
```json
{
  "id": "uuid-do-chunk",
  "vector": [0.1, 0.2, ...],
  "payload": {
    "video_id": "uuid-do-video",
    "youtube_id": "abc123",
    "content": "texto do chunk...",
    "chunk_index": 0,
    "video_title": "Título do Vídeo",
    "video_url": "https://youtube.com/watch?v=abc123"
  }
}
```

### 2.3 Models Laravel

- `Video` - Metadados do vídeo (PostgreSQL)
- `WebhookLog` - Logs de requisições (PostgreSQL)

---

## Fase 3: Ingestão de Conteúdo

### 3.1 Agente RAG com Neuron AI

Criar classe de agente RAG que herda de `NeuronAI\RAG`:

```php
namespace App\Neuron;

use NeuronAI\RAG;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Ollama;
use NeuronAI\RAG\Embeddings\EmbeddingsProviderInterface;
use NeuronAI\RAG\Embeddings\OllamaEmbeddings;
use NeuronAI\RAG\VectorStore\VectorStoreInterface;
use NeuronAI\RAG\VectorStore\QdrantVectorStore;

class VideoAssistant extends RAG
{
    protected function provider(): AIProviderInterface
    {
        return new Ollama(
            url: config('neuron.ollama.url'),
            model: config('neuron.ollama.model'),
        );
    }

    protected function embeddings(): EmbeddingsProviderInterface
    {
        return new OllamaEmbeddings(
            url: config('neuron.ollama.url'),
            model: config('neuron.ollama.embedding_model'),
        );
    }

    protected function vectorStore(): VectorStoreInterface
    {
        return new QdrantVectorStore(
            collectionUrl: config('neuron.qdrant.url') . '/collections/videos',
        );
    }

    public function instructions(): string
    {
        return <<<PROMPT
        Você é um assistente de educação financeira.
        Responda perguntas baseado no contexto dos vídeos do canal doutor.equilibrio.
        Seja breve e objetivo.
        Sempre indique o vídeo fonte ao final da resposta.
        PROMPT;
    }
}
```

### 3.2 Command: IngestTranscripts

```bash
php artisan transcripts:ingest {--path=} {--video-id=}
```

**Fluxo:**
1. Ler arquivos .txt de `Traducoes/output/`
2. Para cada arquivo:
   - Extrair video_id do nome
   - Criar registro em `videos` (PostgreSQL)
   - Usar DataLoader do Neuron para processar texto
   - Neuron faz chunking + embedding automaticamente
   - Neuron salva no Qdrant via QdrantVectorStore

```php
// Exemplo de ingestão com Neuron AI
$agent = VideoAssistant::make();

foreach ($files as $file) {
    $videoId = basename($file, '.txt');

    // Salvar metadados no PostgreSQL
    $video = Video::create([
        'youtube_id' => $videoId,
        'title' => $this->fetchTitle($videoId),
        'url' => "https://youtube.com/watch?v={$videoId}",
    ]);

    // Ingerir no Qdrant via Neuron (chunking + embedding automático)
    $agent->addDocuments(
        FileDataLoader::for($file)
            ->withMetadata([
                'video_id' => $video->id,
                'youtube_id' => $videoId,
                'video_title' => $video->title,
                'video_url' => $video->url,
            ])
            ->getDocuments()
    );
}
```

### 3.3 Chunking e Embeddings (automático pelo Neuron)

- **Chunking:** Gerenciado pelo DataLoader do Neuron
- **Embeddings:** Gerados pelo EmbeddingsProvider configurado
- **Storage:** QdrantVectorStore salva automaticamente

Para desenvolvimento local (Ollama):
- Modelo de embedding: `nomic-embed-text` (dimensão 768) ou `mxbai-embed-large` (dimensão 1024)

Para produção (OpenAI):
- Modelo: `text-embedding-3-small` (dimensão 1536)

### 3.4 Atualização Incremental

O Neuron AI **não verifica duplicatas** automaticamente. A tabela `videos` no PostgreSQL serve como registro de controle para evitar reingestão de conteúdo já processado.

#### Estratégia

```
1. Listar arquivos em Traducoes/output/
2. Para cada arquivo:
   - Extrair youtube_id do nome do arquivo
   - Verificar se existe em PostgreSQL (tabela videos)
   - Se NÃO existe → ingerir no Qdrant + criar registro
   - Se existe → pular (já foi ingerido)
```

#### Comandos Disponíveis

```bash
# Ingerir apenas novos (padrão) - uso diário
php artisan transcripts:ingest

# Forçar reingestão de tudo (apaga e recria collection)
php artisan transcripts:ingest --fresh

# Reingerir vídeo específico (atualizar transcrição corrigida)
php artisan transcripts:ingest --video=abc123 --force
```

#### Cenários de Uso

| Cenário | Comando | Resultado |
|---------|---------|-----------|
| Primeira ingestão | `transcripts:ingest` | Ingere todos os arquivos |
| +15 novos amanhã | `transcripts:ingest` | Ingere apenas os 15 novos |
| Corrigir transcrição | `transcripts:ingest --video=abc123 --force` | Deleta chunks antigos e reingere |
| Resetar tudo | `transcripts:ingest --fresh` | Apaga collection e reingere tudo |

#### Implementação do Command

```php
// app/Console/Commands/IngestTranscripts.php

namespace App\Console\Commands;

use App\Models\Video;
use App\Neuron\VideoAssistant;
use Illuminate\Console\Command;
use NeuronAI\RAG\DataLoader\FileDataLoader;

class IngestTranscripts extends Command
{
    protected $signature = 'transcripts:ingest
                            {--path= : Caminho para os arquivos de transcrição}
                            {--video= : YouTube ID específico para reingerir}
                            {--force : Forçar reingestão mesmo se já existir}
                            {--fresh : Apagar tudo e reingerir do zero}';

    protected $description = 'Ingere transcrições de vídeos no Qdrant';

    public function handle(): int
    {
        $path = $this->option('path') ?? base_path('../Traducoes/output');
        $specificVideo = $this->option('video');
        $force = $this->option('force');
        $fresh = $this->option('fresh');

        // Modo --fresh: apaga tudo e recomeça
        if ($fresh) {
            if (!$this->confirm('Isso apagará TODOS os dados. Continuar?')) {
                return self::FAILURE;
            }
            $this->warn('Modo --fresh: apagando todos os dados...');
            Video::truncate();
            $this->call('qdrant:reset-collection');
        }

        // Listar arquivos
        $files = glob("{$path}/*.txt");
        if (empty($files)) {
            $this->error("Nenhum arquivo encontrado em {$path}");
            return self::FAILURE;
        }

        // Filtrar por vídeo específico se informado
        if ($specificVideo) {
            $files = array_filter($files, fn($f) =>
                basename($f, '.txt') === $specificVideo
            );
        }

        // IDs já existentes no banco
        $existingIds = Video::pluck('youtube_id')->toArray();

        $agent = VideoAssistant::make();
        $newCount = 0;
        $skippedCount = 0;
        $updatedCount = 0;

        foreach ($files as $file) {
            $youtubeId = basename($file, '.txt');
            $exists = in_array($youtubeId, $existingIds);

            // Pular se já existe e não é --force nem --fresh
            if ($exists && !$force && !$fresh) {
                $this->line("  Pulando {$youtubeId} (já existe)");
                $skippedCount++;
                continue;
            }

            // Se --force em vídeo existente, deletar chunks antigos
            if ($exists && $force) {
                $this->info("  Atualizando {$youtubeId}...");
                $this->deleteVideoChunks($youtubeId);
                $updatedCount++;
            } else {
                $this->info("  Ingerindo {$youtubeId}...");
                $newCount++;
            }

            // Criar ou atualizar registro no PostgreSQL
            $video = Video::updateOrCreate(
                ['youtube_id' => $youtubeId],
                [
                    'title' => $this->fetchVideoTitle($youtubeId),
                    'url' => "https://youtube.com/watch?v={$youtubeId}",
                    'channel' => 'doutor.equilibrio',
                ]
            );

            // Ingerir no Qdrant via Neuron
            $agent->addDocuments(
                FileDataLoader::for($file)
                    ->withMetadata([
                        'video_id' => $video->id,
                        'youtube_id' => $youtubeId,
                        'video_title' => $video->title,
                        'video_url' => $video->url,
                    ])
                    ->getDocuments()
            );
        }

        $this->newLine();
        $this->info("Concluído!");
        $this->table(
            ['Novos', 'Atualizados', 'Pulados'],
            [[$newCount, $updatedCount, $skippedCount]]
        );

        return self::SUCCESS;
    }

    /**
     * Deletar chunks de um vídeo específico no Qdrant
     */
    private function deleteVideoChunks(string $youtubeId): void
    {
        // Usar API do Qdrant para deletar por filtro
        $qdrantUrl = config('neuron.qdrant.url');
        $collection = config('neuron.qdrant.collection');

        Http::post("{$qdrantUrl}/collections/{$collection}/points/delete", [
            'filter' => [
                'must' => [
                    ['key' => 'youtube_id', 'match' => ['value' => $youtubeId]]
                ]
            ]
        ]);
    }

    /**
     * Buscar título do vídeo via YouTube API ou usar fallback
     */
    private function fetchVideoTitle(string $youtubeId): string
    {
        // TODO: Implementar chamada à YouTube Data API
        // Por enquanto, retorna placeholder
        return "Vídeo {$youtubeId}";
    }
}
```

#### Command para Resetar Collection

```php
// app/Console/Commands/ResetQdrantCollection.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ResetQdrantCollection extends Command
{
    protected $signature = 'qdrant:reset-collection';
    protected $description = 'Deleta e recria a collection do Qdrant';

    public function handle(): int
    {
        $url = config('neuron.qdrant.url');
        $collection = config('neuron.qdrant.collection');
        $vectorSize = config('neuron.qdrant.vector_size', 768);

        // Deletar collection existente
        $this->info("Deletando collection {$collection}...");
        Http::delete("{$url}/collections/{$collection}");

        // Criar nova collection
        $this->info("Criando collection {$collection}...");
        $response = Http::put("{$url}/collections/{$collection}", [
            'vectors' => [
                'size' => $vectorSize,
                'distance' => 'Cosine',
            ]
        ]);

        if ($response->successful()) {
            $this->info("Collection {$collection} criada com sucesso!");
            return self::SUCCESS;
        }

        $this->error("Erro ao criar collection: " . $response->body());
        return self::FAILURE;
    }
}
```

---

## Fase 4: Webhook

### 4.1 Endpoint

```
POST /webhook/message
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Como economizar dinheiro?",
  "type": "text"
}
```

### 4.2 Controller: Webhook/Message

```php
namespace App\Http\Controllers\Webhook;

class Message
{
    public function __invoke(Request $request, ProcessMessage $action)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|in:text,audio,image'
        ]);

        // M1 só processa type=text
        if ($validated['type'] !== 'text') {
            return response()->json([
                'phone' => $validated['phone'],
                'response' => 'Tipo de mensagem não suportado ainda.',
                'error' => true
            ]);
        }

        return $action->handle($validated);
    }
}
```

### 4.3 Action: ProcessMessage

1. Identificar tipo de mensagem (text/audio/image)
2. Para type=text: chamar ProcessQuestion (RAG)
3. Retornar resposta formatada com vídeo fonte

---

## Fase 5: Motor RAG (via Neuron AI)

O Neuron AI gerencia todo o fluxo RAG automaticamente:

1. Recebe a pergunta do usuário
2. Gera embedding da pergunta
3. Busca documentos similares no Qdrant
4. Injeta contexto no prompt
5. Chama o LLM para gerar resposta
6. Retorna resposta com metadados

### 5.1 Action: ProcessQuestion

```php
namespace App\Actions\Rag;

use App\Neuron\VideoAssistant;
use NeuronAI\Chat\Messages\UserMessage;

class ProcessQuestion
{
    public function handle(string $question): array
    {
        $agent = VideoAssistant::make();

        // Neuron faz RAG automaticamente:
        // 1. Embedding da pergunta
        // 2. Busca no Qdrant
        // 3. Injeta contexto
        // 4. Gera resposta
        $response = $agent->chat(new UserMessage($question));

        // Extrair metadados do vídeo fonte dos documentos recuperados
        $sourceDocument = $response->getRetrievedDocuments()->first();

        return [
            'response' => $response->getContent(),
            'video_url' => $sourceDocument?->metadata['video_url'] ?? null,
            'video_title' => $sourceDocument?->metadata['video_title'] ?? null,
        ];
    }
}
```

### 5.2 Fluxo Interno do Neuron (automático)

```
Pergunta do usuário
    ↓
VideoAssistant::chat()
    ↓
EmbeddingsProvider::embed(pergunta)
    ↓
QdrantVectorStore::similaritySearch(embedding)
    ↓
Documentos relevantes recuperados
    ↓
Prompt = instructions + contexto + pergunta
    ↓
AIProvider::generate(prompt)
    ↓
Resposta contextualizada
```

---

## Fase 6: Configuração

### 6.1 Desenvolvimento (Ollama + Qdrant local)

```env
# Neuron AI
NEURON_PROVIDER=ollama
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Qdrant
QDRANT_URL=http://qdrant:6333
QDRANT_COLLECTION=videos
```

### 6.2 Produção (OpenAI + Qdrant Cloud)

```env
# Neuron AI
NEURON_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Qdrant Cloud
QDRANT_URL=https://xxx.qdrant.io:6333
QDRANT_API_KEY=...
QDRANT_COLLECTION=videos
```

### 6.3 Config: config/neuron.php

```php
return [
    'provider' => env('NEURON_PROVIDER', 'ollama'),

    'ollama' => [
        'url' => env('OLLAMA_URL', 'http://localhost:11434'),
        'model' => env('OLLAMA_MODEL', 'llama3.2'),
        'embedding_model' => env('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text'),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'embedding_model' => env('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
    ],

    'qdrant' => [
        'url' => env('QDRANT_URL', 'http://localhost:6333'),
        'api_key' => env('QDRANT_API_KEY'),
        'collection' => env('QDRANT_COLLECTION', 'videos'),
    ],
];
```

---

## Arquivos a Criar

### Setup
- [ ] `.gitignore` (projeto pai) - adicionar api/ e front/
- [ ] `api/` - projeto Laravel 12
- [ ] `api/docker-compose.yml` - PHP, PostgreSQL, Qdrant, Redis
- [ ] `api/.env.example`

### Migrations
- [ ] `create_videos_table`
- [ ] `create_webhook_logs_table`

### Models
- [ ] `app/Models/Video.php`
- [ ] `app/Models/WebhookLog.php`

### Neuron AI (Agente RAG)
- [ ] `app/Neuron/VideoAssistant.php` - Agente RAG principal

### Actions
- [ ] `app/Actions/Webhook/ProcessMessage.php`
- [ ] `app/Actions/Rag/ProcessQuestion.php`

### Controllers
- [ ] `app/Http/Controllers/Webhook/Message.php` - Webhook para WhatsApp
- [ ] `app/Http/Controllers/Chat.php` - Interface de teste web

### Commands
- [ ] `app/Console/Commands/IngestTranscripts.php` - Ingestão incremental de transcrições
- [ ] `app/Console/Commands/ResetQdrantCollection.php` - Resetar collection do Qdrant

### Config
- [ ] `config/neuron.php`

### Views
- [ ] `resources/views/chat.blade.php` - Interface de chat para teste

### Testes
- [ ] `tests/Feature/Webhook/MessageTest.php`
- [ ] `tests/Unit/Actions/Rag/ProcessQuestionTest.php`
- [ ] `tests/Unit/Neuron/VideoAssistantTest.php`

---

## Verificação

### Testes Automatizados
```bash
cd api
php artisan test
```

### Teste Manual do Webhook
```bash
curl -X POST http://localhost:8000/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"phone":"5511999999999","message":"Como economizar dinheiro?","type":"text"}'
```

### Verificar Ingestão
```bash
# Ingerir transcrições
php artisan transcripts:ingest

# Verificar registros no PostgreSQL
php artisan tinker
> Video::count()

# Verificar pontos no Qdrant
curl http://localhost:6333/collections/videos | jq '.result.points_count'
```

---

## Ordem de Execução

1. **Setup inicial** - .gitignore, criar projeto Laravel, docker-compose
2. **Docker** - Subir containers (PHP, PostgreSQL, Qdrant, Redis)
3. **Migrations** - Criar tabelas videos, webhook_logs
4. **Qdrant** - Criar collection via command
5. **Models** - Video, WebhookLog
6. **Neuron** - Configurar VideoAssistant (agente RAG)
7. **Ingestão** - Command para processar transcrições
8. **Webhook** - Controller + rota para WhatsApp
9. **Interface de Chat** - Página web para testar RAG
10. **Testes** - Feature e Unit tests
11. **Validação** - Testar fluxo completo via interface web e curl

---

## Dependências

### Composer (Laravel)

```bash
composer require neuron-ai/neuron-ai
```

### Docker Services

| Serviço | Imagem | Porta |
|---------|--------|-------|
| app | php:8.3-fpm | 9000 |
| nginx | nginx:alpine | 8000 |
| postgres | postgres:16 | 5432 |
| qdrant | qdrant/qdrant:latest | 6333, 6334 |
| redis | redis:alpine | 6379 |

### Ollama (desenvolvimento local)

Instalar Ollama e baixar modelos:
```bash
# Instalar Ollama (macOS)
brew install ollama

# Baixar modelos
ollama pull llama3.2
ollama pull nomic-embed-text
```

---

## Fase 7: Interface de Teste (Chat Web)

### 7.1 Objetivo

Criar uma página web simples para testar o RAG antes de integrar com WhatsApp. Servirá como:
- Validação do funcionamento do RAG
- Interface administrativa para testes
- Pode ser descontinuada ou mantida como ferramenta de debug

### 7.2 Funcionalidades

- Campo de texto para digitar perguntas
- Botão "Enviar" ou Enter para submeter
- Área de resposta com:
  - Texto da resposta do RAG
  - Link para o vídeo fonte
  - Título do vídeo
- Histórico de perguntas/respostas na sessão
- Indicador de loading durante processamento

### 7.3 Rota

```php
// routes/web.php
Route::get('/', fn() => view('chat'))->name('chat');
Route::post('/ask', [App\Http\Controllers\Chat::class, '__invoke'])->name('ask');
```

### 7.4 Controller: Chat

```php
namespace App\Http\Controllers;

use App\Actions\Rag\ProcessQuestion;
use Illuminate\Http\Request;

class Chat
{
    public function __invoke(Request $request, ProcessQuestion $action)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $result = $action->handle($validated['question']);

        return response()->json($result);
    }
}
```

### 7.5 View: chat.blade.php

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>FinAssistant - Chat de Teste</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto max-w-2xl p-4">
        <header class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800">FinAssistant</h1>
            <p class="text-gray-600">Chat de Teste - RAG Educação Financeira</p>
        </header>

        <!-- Área de mensagens -->
        <div id="messages" class="bg-white rounded-lg shadow p-4 mb-4 h-96 overflow-y-auto">
            <div class="text-gray-400 text-center py-8" id="empty-state">
                Faça uma pergunta sobre educação financeira...
            </div>
        </div>

        <!-- Input -->
        <form id="chat-form" class="flex gap-2">
            <input
                type="text"
                id="question"
                name="question"
                placeholder="Digite sua pergunta..."
                class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                autocomplete="off"
            >
            <button
                type="submit"
                id="send-btn"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
                Enviar
            </button>
        </form>
    </div>

    <script>
        const form = document.getElementById('chat-form');
        const input = document.getElementById('question');
        const messages = document.getElementById('messages');
        const emptyState = document.getElementById('empty-state');
        const sendBtn = document.getElementById('send-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const question = input.value.trim();
            if (!question) return;

            // Esconder estado vazio
            if (emptyState) emptyState.remove();

            // Adicionar pergunta
            addMessage('user', question);
            input.value = '';

            // Loading
            sendBtn.disabled = true;
            const loadingId = addMessage('assistant', '⏳ Pensando...');

            try {
                const response = await fetch('/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ question })
                });

                const data = await response.json();

                // Remover loading
                document.getElementById(loadingId)?.remove();

                // Adicionar resposta
                let content = data.response;
                if (data.video_url) {
                    content += `\n\n📺 <a href="${data.video_url}" target="_blank" class="text-green-600 hover:underline">${data.video_title || 'Ver vídeo'}</a>`;
                }
                addMessage('assistant', content, true);

            } catch (error) {
                document.getElementById(loadingId)?.remove();
                addMessage('assistant', '❌ Erro ao processar pergunta. Tente novamente.');
            }

            sendBtn.disabled = false;
        });

        function addMessage(role, content, isHtml = false) {
            const id = 'msg-' + Date.now();
            const div = document.createElement('div');
            div.id = id;
            div.className = `mb-4 ${role === 'user' ? 'text-right' : 'text-left'}`;

            const bubble = document.createElement('div');
            bubble.className = `inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800'
            }`;

            if (isHtml) {
                bubble.innerHTML = content.replace(/\n/g, '<br>');
            } else {
                bubble.textContent = content;
            }

            div.appendChild(bubble);
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;

            return id;
        }
    </script>
</body>
</html>
```

### 7.6 Arquivos Adicionais

- [ ] `resources/views/chat.blade.php` - Interface de chat
- [ ] `app/Http/Controllers/Chat.php` - Controller do chat web

### 7.7 Resultado Esperado

Ao acessar `http://localhost:8000/`:

```
┌─────────────────────────────────────────┐
│           FinAssistant                  │
│   Chat de Teste - RAG Educação Financeira│
├─────────────────────────────────────────┤
│                                         │
│  👤 Como economizar dinheiro ganhando   │
│     pouco?                              │
│                                         │
│  🤖 Para economizar com renda baixa,    │
│     o Dr. Equilíbrio recomenda começar  │
│     pelo controle de gastos...          │
│                                         │
│     📺 5 Dicas para Economizar          │
│                                         │
├─────────────────────────────────────────┤
│ [Digite sua pergunta...        ] [Enviar]│
└─────────────────────────────────────────┘
```

---

## Entregáveis do M1

Ao final do milestone, teremos:

1. **Backend Laravel 12** configurado com Docker
2. **Qdrant** populado com transcrições do canal doutor.equilibrio
3. **Webhook** `/webhook/message` para integração com WhatsApp
4. **Interface de Chat** para testar o RAG visualmente
5. **Commands** para ingestão incremental de transcrições
6. **Testes** automatizados

---

## Próximos Passos (pós-M1)

- M2: Adicionar suporte a type=audio no webhook
- M3: Adicionar suporte a type=image no webhook
- M4: API financeira completa (contas, categorias, transações)
