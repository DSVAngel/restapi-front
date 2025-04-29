# Usa Node.js como base
FROM node:20

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias primero
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expón el puerto que tu app usa (ajústalo si es diferente)
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["npm", "start"]
