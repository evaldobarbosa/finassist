#!/usr/bin/env python3

import sys
import os
import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

def extract_video_id(url: str) -> str | None:
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11})",
        r"youtu\.be\/([0-9A-Za-z_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def sanitize_filename(name: str) -> str:
    return re.sub(r'[<>:"/\\|?*]', '_', name).strip()

def download_transcript(api: YouTubeTranscriptApi, video_id: str, output_dir: str) -> bool:
    languages = ["pt", "pt-BR", "pt-br", "en"]
    try:
        transcript_list = api.list(video_id)

        # Tenta legendas manuais primeiro, depois automáticas
        transcript = None
        try:
            transcript = transcript_list.find_manually_created_transcript(languages)
            print(f"  ✓ Legenda manual encontrada: {transcript.language} ({transcript.language_code})")
        except Exception:
            pass

        if not transcript:
            try:
                transcript = transcript_list.find_generated_transcript(languages)
                print(f"  ✓ Legenda automática encontrada: {transcript.language} ({transcript.language_code})")
            except Exception:
                pass

        if not transcript:
            # Pega qualquer uma disponível e traduz para PT
            all_transcripts = list(transcript_list)
            if not all_transcripts:
                print(f"  ✗ Nenhuma transcrição disponível.")
                return False
            transcript = all_transcripts[0].translate("pt")
            print(f"  ↻ Traduzindo para português...")

        data = transcript.fetch()
        text = "\n".join([entry.text for entry in data])

        out_path = os.path.join(output_dir, f"{video_id}.txt")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)

        print(f"  ✓ Salvo em: {out_path} ({len(data)} linhas)")
        return True

    except TranscriptsDisabled:
        print(f"  ✗ Transcrições desativadas para este vídeo.")
    except NoTranscriptFound:
        print(f"  ✗ Nenhuma transcrição encontrada.")
    except Exception as e:
        print(f"  ✗ Erro: {e}")
    return False

def main():
    if len(sys.argv) < 2:
        print("Uso: python download_transcripts.py <arquivo_urls.txt> [pasta_de_saída]")
        sys.exit(1)

    urls_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "/output"

    if not os.path.isfile(urls_file):
        print(f"Erro: arquivo '{urls_file}' não encontrado.")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    with open(urls_file, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]

    print(f"📋 {len(lines)} URL(s) encontrada(s) em '{urls_file}'")
    print(f"📁 Saída em: {output_dir}\n")

    api = YouTubeTranscriptApi()
    ok, fail = 0, 0
    for i, url in enumerate(lines, 1):
        print(f"[{i}/{len(lines)}] {url}")
        video_id = extract_video_id(url)
        if not video_id:
            print(f"  ✗ URL inválida, ignorando.")
            fail += 1
            continue
        if download_transcript(api, video_id, output_dir):
            ok += 1
        else:
            fail += 1
        print()

    print(f"✅ Concluído: {ok} baixadas | ❌ {fail} falhas")

if __name__ == "__main__":
    main()