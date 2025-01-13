# server/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ajouter pytest pour les tests
RUN pip install --no-cache-dir pytest httpx

# Ajouter le répertoire de l'application au PYTHONPATH
ENV PYTHONPATH=/app

# Copier tout le code de l'application dans le conteneur
COPY . .

# Exposer le port et définir la commande de démarrage
EXPOSE 8000
CMD ["uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
