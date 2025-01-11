# server/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application dans le conteneur
COPY . .

# Exposer le port et définir la commande de démarrage
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
