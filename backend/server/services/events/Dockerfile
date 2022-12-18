
# Install dependencies
FROM node:16.13.0-alpine3.14 AS deps

ENV service=events

WORKDIR /shared
COPY services/shared/package*.json ./
RUN npm ci

WORKDIR /app
COPY services/${service}/package*.json ./
RUN npm ci

# Build source code
FROM node:16.13.0-alpine3.14 AS builder

ENV service=events

WORKDIR /shared
COPY services/shared ./
COPY --from=deps /shared/node_modules ./node_modules
RUN npm run build
# Remove old node_modules and install only production dependencies
RUN rm -rf node_modules \
    && npm ci --production

WORKDIR /app
COPY services/${service} ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build
RUN rm -rf node_modules \
    && npm ci --production

FROM node:16.13.0-alpine3.14 AS production

WORKDIR /shared
COPY --from=builder /shared/package*.json ./
COPY --from=builder /shared/node_modules ./node_modules
COPY --from=builder /shared/dist ./dist

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 9000

CMD ["npm","start"]