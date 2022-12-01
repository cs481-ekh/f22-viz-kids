FROM node:hydrogen-alpine AS builder
RUN adduser -S build
WORKDIR /usr/src/movilo

COPY package.json .
COPY package-lock.json .
RUN chown -R build .

USER build
RUN npm install

COPY . .
RUN ./build.sh

FROM nginx:1.23-alpine
COPY --from=builder /usr/src/movilo/dist/ /usr/share/nginx/html/
