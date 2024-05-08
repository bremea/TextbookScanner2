FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

ENTRYPOINT ["bun", "preview"]