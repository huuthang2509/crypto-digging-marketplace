# Install dependencies
FROM node:16.13.0-alpine3.14 AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build source code
FROM node:16.13.0-alpine3.14 AS builder

WORKDIR /app
COPY package*.json ./
COPY next.config.js tsconfig.json ./
COPY .env.local ./
COPY public ./public
COPY src ./src

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Remove old node_modules and install only production dependencies
RUN rm -rf node_modules \
    && npm ci --production

# Production image
FROM node:16.13.0-alpine3.14 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder app/next.config.js ./
COPY --from=builder app/package*.json ./
COPY --from=builder app/public ./public

COPY --from=builder app/node_modules ./node_modules

COPY --from=builder --chown=nextjs:nodejs app/.next ./.next

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]