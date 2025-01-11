from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, nullable=False, default="TODO")
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="tasks")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))

    author = relationship("User", backref="comments")
    project = relationship("Project", backref="comments")
    task = relationship("Task", backref="comments")
