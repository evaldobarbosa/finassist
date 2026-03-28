# Ingestão de Transcrições

> **Status:** Pendente
> **Milestone:** M1 - Sugestão de Vídeos (RAG)
> **Sprint:** 02
> **Data de criação:** 2026-03-28
> **Última atualização:** 2026-03-28

## Descrição

Command Artisan para ingestão incremental de transcrições de vídeos do YouTube no Qdrant. Suporta ingestão de novos arquivos, atualização de vídeos específicos e reset completo da base.

## User Story

**Como** administrador do sistema
**Quero** ingerir transcrições de vídeos no banco vetorial
**Para** alimentar o RAG com conteúdo para responder perguntas dos usuários

## Critérios de Aceitação

```gherkin
Funcionalidade: Ingestão de transcrições

  Cenário: Primeira ingestão
    Dado que a collection "videos" está vazia
    E existem 6 arquivos .txt em Traducoes/output/
    Quando executo "php artisan transcripts:ingest"
    Então 6 registros devem ser criados na tabela videos
    E os chunks devem ser gerados e salvos no Qdrant
    E a saída deve mostrar "6 novos, 0 atualizados, 0 pulados"

  Cenário: Ingestão incremental (novos arquivos)
    Dado que já existem 6 vídeos ingeridos
    E adiciono 2 novos arquivos em Traducoes/output/
    Quando executo "php artisan transcripts:ingest"
    Então apenas 2 novos registros devem ser criados
    E os 6 existentes não devem ser reprocessados
    E a saída deve mostrar "2 novos, 0 atualizados, 6 pulados"

  Cenário: Atualizar vídeo específico
    Dado que o vídeo "abc123" já foi ingerido
    E a transcrição foi corrigida
    Quando executo "php artisan transcripts:ingest --video=abc123 --force"
    Então os chunks antigos de "abc123" devem ser deletados do Qdrant
    E os novos chunks devem ser ingeridos
    E a saída deve mostrar "0 novos, 1 atualizados, 0 pulados"

  Cenário: Reset completo
    Dado que existem vídeos ingeridos
    Quando executo "php artisan transcripts:ingest --fresh"
    E confirmo a operação
    Então todos os registros devem ser deletados da tabela videos
    E a collection do Qdrant deve ser resetada
    E todos os arquivos devem ser reingeridos

  Cenário: Cancelar reset
    Dado que existem vídeos ingeridos
    Quando executo "php artisan transcripts:ingest --fresh"
    E não confirmo a operação
    Então nenhuma alteração deve ser feita
```

## Comandos

```bash
# Ingerir apenas novos (uso diário)
php artisan transcripts:ingest

# Especificar caminho dos arquivos
php artisan transcripts:ingest --path=/caminho/para/arquivos

# Atualizar vídeo específico
php artisan transcripts:ingest --video=abc123 --force

# Reset completo (com confirmação)
php artisan transcripts:ingest --fresh
```

## Fluxo de Ingestão

```
1. Listar arquivos .txt no diretório
    ↓
2. Para cada arquivo:
    ↓
3. Extrair youtube_id do nome (basename sem .txt)
    ↓
4. Verificar se existe na tabela videos
    ↓
5. Se existe e não é --force → pular
    ↓
6. Se existe e é --force → deletar chunks do Qdrant
    ↓
7. Criar/atualizar registro em videos (PostgreSQL)
    ↓
8. Carregar arquivo com FileDataLoader
    ↓
9. Adicionar metadados (video_id, youtube_id, title, url)
    ↓
10. Neuron faz chunking + embedding + salva no Qdrant
    ↓
11. Exibir progresso e resumo final
```

## Regras de Negócio

1. **[RN01]** - Arquivos devem ter extensão `.txt`
2. **[RN02]** - Nome do arquivo deve ser o `youtube_id` do vídeo
3. **[RN03]** - Duplicatas são identificadas pelo `youtube_id` na tabela videos
4. **[RN04]** - Flag `--fresh` requer confirmação interativa
5. **[RN05]** - Metadados são anexados aos chunks para rastreabilidade

## Dependências

- [x] Tabela `videos` criada (migration)
- [x] Qdrant configurado e acessível
- [x] VideoAssistant configurado (para addDocuments)
- [x] Arquivos de transcrição em `Traducoes/output/`

## Estrutura do Arquivo de Transcrição

**Nome:** `{youtube_id}.txt`

**Exemplo:** `l6tygr1tlvE.txt`

**Conteúdo:** Texto puro da transcrição do vídeo

## Endpoints da API

N/A - Esta feature é um command Artisan, não expõe endpoints.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `app/Console/Commands/IngestTranscripts.php` | Command principal |
| `app/Console/Commands/ResetQdrantCollection.php` | Command auxiliar para reset |

## Código do Command

```php
protected $signature = 'transcripts:ingest
                        {--path= : Caminho para os arquivos de transcrição}
                        {--video= : YouTube ID específico para reingerir}
                        {--force : Forçar reingestão mesmo se já existir}
                        {--fresh : Apagar tudo e reingerir do zero}';

protected $description = 'Ingere transcrições de vídeos no Qdrant';
```

## Metadados Anexados aos Chunks

```php
[
    'video_id' => 'uuid-do-registro-no-postgres',
    'youtube_id' => 'l6tygr1tlvE',
    'video_title' => 'Título do Vídeo',
    'video_url' => 'https://youtube.com/watch?v=l6tygr1tlvE',
]
```

## Observações

- Primeira ingestão pode demorar (geração de embeddings)
- Progresso é exibido em tempo real
- Tabela final mostra resumo (novos, atualizados, pulados)
- Deletar chunks no Qdrant usa filtro por `youtube_id`

---

## Histórico de Aprovações

| Data | Responsável | Tipo | Observação |
|------|-------------|------|------------|
| 2026-03-28 | - | Feature | Documentação inicial criada |
