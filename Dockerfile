# Estágio 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# build-local = tsc + tsc-alias apenas. O script "build" faria `cp .env ./build/.env`,
# gravando segredos de produção dentro da imagem — inaceitável em registry público.
# As variáveis chegam em runtime pelo env_file do docker-compose.
RUN yarn build-local

# Estágio 2: Execução (Imagem Final)
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copia o código compilado (outDir = ./build)
COPY --from=builder /usr/src/app/build ./build

# Copia o ormconfig para o TypeORM encontrar
COPY ormconfig.ts ./

# Copia uploads (pasta para arquivos estáticos)
RUN mkdir -p uploads

EXPOSE 3333
CMD ["node", "build/src/shared/infra/http/server.js"]