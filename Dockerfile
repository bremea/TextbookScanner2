FROM mariadb:latest

WORKDIR /app

ENV BUN_VERSION=bun-v1.0.33
ENV MARIADB_DATABASE=textbooks

COPY . .

ADD db/init.sql /docker-entrypoint-initdb.d

RUN apt install -y curl
RUN curl -fsSL https://bun.sh/install | sh -s $BUN_VERSION

RUN bun install
RUN bun run build

ENTRYPOINT ["bun", "preview"]