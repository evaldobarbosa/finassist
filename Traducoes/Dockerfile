FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir youtube-transcript-api

COPY download_transcripts.py .

RUN chmod +x download_transcripts.py

VOLUME ["/input", "/output"]

ENTRYPOINT ["python", "download_transcripts.py"]
CMD ["/input/urls.txt", "/output"]