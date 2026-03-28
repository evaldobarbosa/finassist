# 🎬 YouTube Transcript Downloader

Baixa transcrições de vídeos do YouTube a partir de um arquivo `.txt` com URLs.

## Estrutura
```
.
├── Dockerfile
├── download_transcripts.py
└── urls.txt           ← seu arquivo de URLs
```

## Como usar

### 1. Build da imagem
```bash
docker build -t yt-transcripts .
```

### 2. Prepare seu arquivo de URLs
Crie um arquivo `urls.txt` com uma URL por linha:
```
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/XXXXXXXXXXX
# comentários são ignorados
```

### 3. Execute o container
```bash
docker run --rm \
  -v $(pwd)/urls.txt:/input/urls.txt \
  -v $(pwd)/output:/output \
  yt-transcripts
```

As transcrições serão salvas em `./output/` como arquivos `.txt` nomeados pelo ID do vídeo.

### Usando um arquivo com nome diferente
```bash
docker run --rm \
  -v $(pwd)/minha_lista.txt:/input/urls.txt \
  -v $(pwd)/output:/output \
  yt-transcripts
```

## Comportamento
- Prioriza legendas manuais em PT > PT-BR > EN
- Se não houver manual, usa legenda automática
- Se não houver em PT/EN, traduz automaticamente para PT
- URLs inválidas são ignoradas com aviso
- Linhas com `#` são tratadas como comentários
