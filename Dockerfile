FROM node:18.10.0 as dependencies
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM node:18.10.0 as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build


FROM node:18.10.0
COPY  --from=builder /app/node_modules ./app/node_modules
COPY  --from=builder /app/db ./app/db
COPY  --from=builder /app/dist ./app/dist
COPY  --from=builder /app/package.json ./app

ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app
EXPOSE 3000
CMD sh -c "npm run start:prod"
