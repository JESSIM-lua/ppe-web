FROM node:alpine3.20 AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM nginx:stable-alpine3.20-slim

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

COPY certs/selfsigned.crt /etc/nginx/ssl/selfsigned.crt
COPY certs/selfsigned.key /etc/nginx/ssl/selfsigned.key

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
