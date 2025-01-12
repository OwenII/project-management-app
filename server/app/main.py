#server\app\main.py
from fastapi import FastAPI
from ariadne.asgi import GraphQL
from fastapi.middleware.cors import CORSMiddleware
from app.schema import schema
from app.database import init_db

# Initialiser la base de données avec des données de test
init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQL(schema, debug=True)
app.mount("/graphql", graphql_app)
