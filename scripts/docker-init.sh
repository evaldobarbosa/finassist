#!/bin/bash

# FinAssistant Docker Initialization Script
# Usage: ./scripts/docker-init.sh

set -e

echo "=== FinAssistant Docker Setup ==="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Go to project root
cd "$(dirname "$0")/.."

echo -e "${YELLOW}1. Building and starting containers...${NC}"
docker compose up -d --build

echo -e "${YELLOW}2. Waiting for services to be ready...${NC}"
sleep 10

# Wait for postgres to be ready
echo "   Waiting for PostgreSQL..."
until docker compose exec -T postgres pg_isready -U finassistant -d finassistant > /dev/null 2>&1; do
  sleep 2
done
echo -e "${GREEN}   PostgreSQL is ready!${NC}"

# Wait for redis to be ready
echo "   Waiting for Redis..."
until docker compose exec -T redis redis-cli ping > /dev/null 2>&1; do
  sleep 2
done
echo -e "${GREEN}   Redis is ready!${NC}"

echo -e "${YELLOW}3. Running database migrations...${NC}"
docker compose exec -T api php artisan migrate --force

echo -e "${YELLOW}4. Seeding default categories for test user...${NC}"
docker compose exec -T api php artisan app:seed-user-categories 98984690450

echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Services running:"
echo "  - API:      http://localhost:8000"
echo "  - Frontend: http://localhost:5173"
echo "  - Mailpit:  http://localhost:8025"
echo "  - Qdrant:   http://localhost:6333"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
echo "To stop:"
echo "  docker compose down"
