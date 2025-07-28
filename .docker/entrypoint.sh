#!/bin/bash

# Esperar o banco de dados ficar disponível
echo "⏳ Aguardando o banco de dados iniciar..."
/home/node/app/.docker/wait-for-it.sh db:5432 --timeout=60 --strict -- echo "✅ Banco de dados está pronto!"

# Instalar dependências
npm install

# Rodar migrations
npm run typeorm migration:run

# Iniciar servidor
npm run dev
