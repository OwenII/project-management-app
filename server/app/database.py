# server\app\database.py
import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# URL de connexion à la base de données SQLite
DATABASE_URL = "sqlite:///./database.db"

# Création de l'engine pour la base de données SQLite avec l'option 'check_same_thread' nécessaire pour SQLite
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Configuration du sessionmaker pour gérer les sessions de base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base déclarative pour les modèles ORM
Base = declarative_base()

# Fonction d'initialisation de la base de données
def init_db():
    # Importation de 'Base' depuis app.models pour créer les tables dans la base de données
    from app.models import Base  

    # Vérification de l'existence du fichier de la base de données
    db_file = DATABASE_URL.replace("sqlite:///", "")
    if not os.path.exists(db_file):
        # Si la base de données n'existe pas, elle est créée
        print(f"Base de données inexistante, création de la base de données : '{db_file}'.")
        Base.metadata.create_all(bind=engine)  # Création de toutes les tables définies dans les modèles
    else:
        # Si la base de données existe, on affiche un message de confirmation
        print(f"Base de données existante trouvée : '{db_file}'.")
