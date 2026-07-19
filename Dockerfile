FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Build tools for better-sqlite3 (used only if no prebuilt binary is available)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Embedded database + admin upload storage
RUN mkdir -p /app/data /app/uploads

EXPOSE 3000

# Seed launch content (idempotent — skips if data exists), then start
CMD ["sh", "-c", "npx tsx db/seed.ts && node dist/boot.js"]
