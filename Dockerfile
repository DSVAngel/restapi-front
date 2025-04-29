# Usamos la imagen oficial de Nginx
FROM nginx:alpine

# Copiamos los archivos estáticos al directorio que Nginx sirve
COPY . /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 8082

# Comando para mantener Nginx corriendo
CMD ["nginx", "-g", "daemon off;"]
