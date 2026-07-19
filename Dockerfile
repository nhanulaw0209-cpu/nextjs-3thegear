FROM node:20-slim

# Install system dependencies (Prisma needs openssl)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

# Next.js inlines NEXT_PUBLIC_* vars at build time, so it must be passed as a
# build arg (not just a runtime env var in docker-compose) to take effect.
ARG NEXT_PUBLIC_GOOGLE_REVIEW_URL
ENV NEXT_PUBLIC_GOOGLE_REVIEW_URL=$NEXT_PUBLIC_GOOGLE_REVIEW_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
