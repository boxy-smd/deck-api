FROM node:22.14-slim

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y \
  openssl \
  python3 \
  make \
  g++

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/

RUN pnpm db:generate

COPY . .

# Ensure bcrypt is correctly installed and rebuilt
RUN pnpm install bcrypt
RUN pnpm rebuild bcrypt

RUN pnpm build

EXPOSE 3333

CMD ["sh", "-c", "pnpm db:deploy && pnpm start"]
