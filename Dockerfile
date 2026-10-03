# Stage 1: Build client and server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for optimal layer caching
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies
RUN npm install

# Copy source code
COPY client/ ./client/
COPY server/ ./server/
COPY tsconfig.json ./

# Build frontend and backend
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy manifests for production server install
COPY package*.json ./
COPY server/package*.json ./server/

# Install server production dependencies only
RUN npm --prefix server install --omit=dev

# Copy built outputs
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 3000

USER node

CMD ["npm", "--prefix", "server", "run", "start"]
