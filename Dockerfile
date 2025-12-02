# --- Build stage ---
FROM node:20 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
