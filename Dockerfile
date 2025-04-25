# Usa una imagen ligera de Nginx para servir archivos estáticos
FROM nginx:alpine

# Elimina el archivo default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia tus archivos del frontend al directorio que Nginx sirve
COPY . /usr/share/nginx/html

# Expone el puerto 80 para acceso al navegador
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]

