FROM node:18

WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia o restante da aplicação
COPY . .

# Expõe a porta se necessário (opcional)
EXPOSE 3333

# Comando padrão
CMD ["yarn", "dev"]
