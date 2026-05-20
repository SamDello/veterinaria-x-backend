FROM node:22-slim AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 3000) + '/', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

USER node

CMD ["npm", "start"]
