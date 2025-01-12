import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import bcrypt

# Charger les variables d'environnement
load_dotenv()

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    from app.models import User, Task, Project, Base

    # Supprimer la base de données existante
    db_file = DATABASE_URL.replace("sqlite:///", "")
    if os.path.exists(db_file):
        os.remove(db_file)
        print(f"Base de données existante '{db_file}' supprimée.")

    # Recréer les tables
    Base.metadata.create_all(bind=engine)

    # Ajouter des données de test
    session = SessionLocal()

    # Ajouter un utilisateur de test
    email_utilisateur = os.getenv("EMAIL_UTILISATEUR")
    mot_de_passe_utilisateur = os.getenv("MOT_DE_PASSE_UTILISATEUR")
    username_utilisateur = os.getenv("USERNAME_UTILISATEUR")  # Récupérer le username depuis les variables d'environnement
    utilisateur = session.query(User).filter(User.email == email_utilisateur).first()
    if not utilisateur:
        # Hachage du mot de passe
        hashed_pwd = bcrypt.hashpw(mot_de_passe_utilisateur.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        # Créer un nouvel utilisateur avec un username
        utilisateur = User(email=email_utilisateur, password=hashed_pwd, username=username_utilisateur)
        session.add(utilisateur)
        session.commit()
    print(f"Utilisateur créé : {utilisateur.id}, {utilisateur.email}, {utilisateur.username}")

    # Créer un projet de test associé à l'utilisateur
    projet_test = session.query(Project).filter(Project.name == "Projet Test").first()
    if not projet_test:
        projet_test = Project(name="Projet Test", description="Un projet pour associer des tâches", owner_id=utilisateur.id)
        session.add(projet_test)
        session.commit()
    print(f"Projet créé : {projet_test.id}, {projet_test.name}, propriétaire_id={projet_test.owner_id}")

    # Ajouter des tâches associées au projet
    taches = [
        {"title": os.getenv("TACHE_1_TITRE"), "status": os.getenv("TACHE_1_STATUT"), "project_id": projet_test.id},
        {"title": os.getenv("TACHE_2_TITRE"), "status": os.getenv("TACHE_2_STATUT"), "project_id": projet_test.id},
        {"title": os.getenv("TACHE_3_TITRE"), "status": os.getenv("TACHE_3_STATUT"), "project_id": projet_test.id},
    ]
    for tache_data in taches:
        if not tache_data["project_id"]:
            print(f"[DEBUG] Tâche invalide détectée sans project_id : {tache_data}")
            continue
        tache = Task(title=tache_data["title"], status=tache_data["status"], project_id=tache_data["project_id"])
        session.add(tache)

    session.commit()
    session.close()
