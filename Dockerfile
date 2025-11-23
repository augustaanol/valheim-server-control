# --- Build stage ---
FROM node:20 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
# kopiujemy tylko package.json + lock, aby bazowy layer cache'ował instalację deps
COPY package*.json ./

RUN npm install

# kopiujemy resztę projektu
COPY . .

RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

EXPOSE 3000

CMD ["npm", "start"]
