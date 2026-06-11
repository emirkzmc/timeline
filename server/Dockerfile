# ─────────────────────────────────────────────
# Stage 1 — Install dependencies
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────────────────────────
# Stage 2 — Build TypeScript
# ─────────────────────────────────────────────
FROM deps AS build

COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 — Production runtime
# ─────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
