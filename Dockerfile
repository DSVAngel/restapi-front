# Usa una imagen ligera de Nginx para servir archivos estáticos
FROM nginx:alpine

# Elimina el archivo default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia tus archivos del frontend al directorio que Nginx sirve
COPY . /usr/share/nginx/html

# Crea configuración para manejar SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Configuración para SPA - redirige todas las solicitudes a index.html \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Ajustes de seguridad básicos \
    add_header X-Content-Type-Options "nosniff"; \
    add_header X-XSS-Protection "1; mode=block"; \
}' > /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para acceso al navegador
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
