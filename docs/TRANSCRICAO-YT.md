# Transcrição de Vídeos do YouTube

Este documento descreve a funcionalidade de download de transcrições de vídeos do YouTube.

## Visão Geral

FinAssistant inclui um utilitário para download de transcrições de vídeos do YouTube, focado em conteúdo em português. Baixa transcrições com fallback inteligente de idioma e é containerizado com Docker.

## Comandos de Build e Execução

Todos os comandos devem ser executados a partir do diretório `Traducoes/`:

```bash
# Build da imagem Docker
docker build -t yt-transcripts .

# Executar com arquivo urls.txt padrão
docker run --rm \
  -v $(pwd)/urls.txt:/input/urls.txt \
  -v $(pwd)/output:/output \
  yt-transcripts

# Executar com arquivo de entrada customizado
docker run --rm \
  -v $(pwd)/minha_lista.txt:/input/urls.txt \
  -v $(pwd)/output:/output \
  yt-transcripts

# Script de conveniência (builda e executa com transcrever.txt)
bash transcrever.sh
```

## Arquitetura

**Aplicação principal**: `Traducoes/download_transcripts.py`
- Extrai IDs de vídeos de URLs do YouTube (suporta formatos `youtube.com/watch?v=` e `youtu.be/`)
- Prioridade de idioma: PT manual > PT-BR > EN, depois auto-gerado, depois auto-tradução para PT
- Gera transcrições como arquivos `{video_id}.txt`

**Setup Docker**: `Traducoes/Dockerfile`
- Imagem base Python 3.12-slim
- Dependência única: `youtube-transcript-api`
- Expõe volumes `/input` e `/output`

## Formato de Entrada

Arquivos de URL devem ter uma URL do YouTube por linha. Linhas começando com `#` são tratadas como comentários e ignoradas.
