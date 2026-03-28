#!/bin/bash

docker build -t yt-transcripts .

docker run --rm \
  -v $(pwd)/transcrever.txt:/input/urls.txt \
  -v $(pwd)/output:/output \
  yt-transcripts