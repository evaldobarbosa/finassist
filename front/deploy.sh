#!/bin/bash
set -e

ENVIRONMENT=${1:-production}

# Configuração
CONTAINER_NAME="zapgrana-front"
HEALTH_PORT=8080
HEALTH_PATH="/health"
HEALTH_RETRIES=10
HEALTH_INTERVAL=3

echo "=== Deploy ZapGrana Frontend - $ENVIRONMENT ==="

# Login no GitHub Container Registry
if [ -f .github_token ]; then
    cat .github_token | docker login ghcr.io -u ${GITHUB_USER:-github} --password-stdin
    rm -f .github_token
fi

# Pull da nova imagem
echo "Baixando imagem..."
docker compose -f docker-compose.github.yml pull front

# Parar containers antigos
echo "Parando containers..."
docker compose -f docker-compose.github.yml down --remove-orphans || true

# Subir novos containers
echo "Iniciando containers..."
docker compose -f docker-compose.github.yml up -d

# Aguardar inicializacao
echo "Aguardando inicializacao..."
sleep 5

# Obter IP do container da rede proxymng
CONTAINER_IP=$(docker inspect -f '{{.NetworkSettings.Networks.proxymng.IPAddress}}' $CONTAINER_NAME 2>/dev/null)
echo "Container IP: $CONTAINER_IP"

# Health check via IP do container
echo "Verificando saude da aplicacao..."
for i in $(seq 1 $HEALTH_RETRIES); do
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://${CONTAINER_IP}:${HEALTH_PORT}${HEALTH_PATH}" 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        echo "Health check passou! (HTTP $response)"
        break
    fi
    echo "Tentativa $i/$HEALTH_RETRIES - HTTP $response, aguardando..."
    if [ "$i" -eq "$HEALTH_RETRIES" ]; then
        echo "Health check falhou apos $HEALTH_RETRIES tentativas"
        exit 1
    fi
    sleep $HEALTH_INTERVAL
done

# Limpar imagens antigas
echo "Limpando imagens antigas..."
docker image prune -f

echo "=== Deploy concluido! ==="
