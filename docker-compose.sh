#!/bin/bash
# Script helper para executar docker compose no WSL

# Tenta usar docker compose (versão 2, sem hífen)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose "$@"
# Tenta usar docker-compose (versão 1, com hífen)
elif command -v docker-compose &> /dev/null; then
    docker-compose "$@"
# Tenta usar docker-compose do Windows via WSL
elif [ -f "/mnt/c/Program Files/Docker/Docker/resources/bin/docker-compose.exe" ]; then
    "/mnt/c/Program Files/Docker/Docker/resources/bin/docker-compose.exe" "$@"
else
    echo "Docker Compose não encontrado!"
    echo "Por favor, instale o Docker Desktop e ative a integração WSL 2"
    exit 1
fi

