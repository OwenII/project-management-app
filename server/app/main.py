# server\app\main.py
from fastapi import FastAPI
from ariadne.asgi import GraphQL
from fastapi.middleware.cors import CORSMiddleware
from app.schema import schema
from app.database import init_db

# Initialiser la base de données, en chargeant des données de test au démarrage de l'application
init_db()

# Création de l'instance FastAPI
app = FastAPI()

# Ajout d'un middleware CORS pour permettre à l'application frontend (sur http://localhost:3000) de faire des requêtes à cette API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Origine autorisée (le frontend sur localhost:3000)
    allow_credentials=True,  # Autoriser l'envoi de cookies avec les requêtes
    allow_methods=["*"],  # Autoriser toutes les méthodes HTTP
    allow_headers=["*"],  # Autoriser tous les en-têtes
)

# Configuration du serveur GraphQL avec Ariadne
graphql_app = GraphQL(schema, debug=True)

# Monter l'endpoint GraphQL sur le chemin /graphql
app.mount("/graphql", graphql_app)
