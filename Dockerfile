# Etapa 1: build de Angular
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: servir con Nginx
FROM nginx:alpine

# Copiar la build de Angular al directorio de Nginx
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
