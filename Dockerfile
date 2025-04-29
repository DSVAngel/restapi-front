# Usa una imagen ligera de Nginx para servir archivos estáticos
# Usa una imagen ligera de Nginx
FROM nginx:alpine

# Elimina los archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos del proyecto al directorio público de Nginx
COPY . /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

