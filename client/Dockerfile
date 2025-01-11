# client/Dockerfile
FROM node:14

WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port et démarrer l'application React
EXPOSE 3000
CMD ["npm", "start"]
