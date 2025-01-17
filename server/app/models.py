# server\app\models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

# Modèle représentant un utilisateur
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique de l'utilisateur
    email = Column(String, unique=True, index=True, nullable=False)  # Email de l'utilisateur (unique)
    password = Column(String, nullable=False)  # Mot de passe de l'utilisateur
    username = Column(String, unique=True, nullable=False)  # Nom d'utilisateur unique

    # Relation avec les commentaires
    comments = relationship("Comment", back_populates="author", cascade="all, delete")
    
    # Relation avec les projets
    projects = relationship("Project", back_populates="owner", cascade="all, delete")


# Modèle représentant un commentaire
class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique du commentaire
    content = Column(String, nullable=False)  # Contenu du commentaire
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # Référence à l'auteur (utilisateur)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))  # Référence au projet
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))  # Référence à la tâche

    # Relation avec User (l'auteur du commentaire)
    author = relationship("User", back_populates="comments")
    # Relation avec Project (le projet associé au commentaire)
    project = relationship("Project", backref="comments")
    # Relation avec Task (la tâche associée au commentaire)
    task = relationship("Task", backref="comments")


# Modèle représentant un projet
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique du projet
    name = Column(String, nullable=False)  # Nom du projet
    description = Column(Text)  # Description du projet
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # Référence à l'utilisateur propriétaire du projet

    # Relation avec User (le propriétaire du projet)
    owner = relationship("User", back_populates="projects")
    # Relation avec Task (les tâches associées au projet)
    tasks = relationship("Task", back_populates="project", cascade="all, delete")


# Modèle représentant une tâche
class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique de la tâche
    title = Column(String, nullable=False)  # Titre de la tâche
    status = Column(String, nullable=False, default="TODO")  # Statut de la tâche (par défaut "TODO")
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)  # Référence au projet auquel la tâche appartient

    # Relation avec Project (le projet auquel la tâche est associée)
    project = relationship("Project", back_populates="tasks")


# Modèle représentant un message de chat
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)  # Identifiant unique du message
    content = Column(Text, nullable=False)  # Contenu du message
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # Référence à l'utilisateur auteur du message
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)  # Référence au projet associé au message
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  # Date de création du message

    # Relation avec User (l'auteur du message)
    author = relationship("User")
    # Relation avec Project (le projet auquel le message est associé)
    project = relationship("Project")
