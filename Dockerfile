# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM deps AS development

COPY . .

EXPOSE 5000 5173

CMD ["npm", "run", "api"]

FROM deps AS build

COPY . .
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY app.js ./
COPY config ./config
COPY controllers ./controllers
COPY lib ./lib
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY public ./public
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "api"]
