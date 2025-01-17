#server\app\resolvers.py
from ariadne import QueryType, MutationType, ObjectType
from .database import SessionLocal
from .models import User, Project, Task, Comment
from sqlalchemy.exc import IntegrityError
from .auth import create_access_token
import bcrypt 

query = QueryType()
mutation = MutationType()

# Résolveurs pour Query
@query.field("projects")
def resolve_projects(*_, filter=None):
    session = SessionLocal()
    try:
        if filter:
            projects = session.query(Project).filter(Project.name.contains(filter)).all()
        else:
           projects = session.query(Project).all()
        return projects
    finally:
        session.close()

@query.field("project")
def resolve_project(*_, id):
    session = SessionLocal()
    project = session.query(Project).filter(Project.id == id).first()
    session.close()
    return project

@query.field("tasks")
def resolve_tasks(*_):
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()
    return tasks

@query.field("task")
def resolve_task(*_, id):
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == id).first()
    session.close()
    return task

@query.field("users")
def resolve_users(*_):
    session = SessionLocal()
    users = session.query(User).all()
    session.close()
    return users

@query.field("user")
def resolve_user(*_, id):
    session = SessionLocal()
    user = session.query(User).filter(User.id == id).first()
    session.close()
    return user

@query.field("commentsByProject")
def resolve_comments_by_project(*_, projectId):
    session = SessionLocal()
    comments = session.query(Comment).filter(Comment.project_id == projectId, Comment.author_id != None).all()
    session.close()
    return comments

# Résolveurs explicites pour les types d'objet
project_type = ObjectType("Project")

@project_type.field("ownerId")
def resolve_project_owner_id(project, *_):
    return project.owner_id

comment_obj = ObjectType("Comment")

# Résolveurs pour Mutation
@mutation.field("createUser")
def resolve_create_user(_, info, email, username, password):
    session = SessionLocal()
    try:
        existing_user = session.query(User).filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            raise Exception("L'email ou le pseudo est déjà utilisé.")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(email=email, username=username, password=hashed_password)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    finally:
        session.close()

@mutation.field("createProject")
def resolve_create_project(_, info, name, description, ownerId):
    print(f"[DEBUG] Mutation appelée avec - name: {name}, description: {description}, ownerId: {ownerId}")
    
    session = SessionLocal()
    try:
        print(f"[DEBUG] Conversion ownerId en entier : {ownerId}")
        ownerId = int(ownerId)
        
        owner = session.query(User).filter(User.id == ownerId).first()
        if not owner:
            print("[DEBUG] Utilisateur non trouvé")
            raise Exception("Utilisateur non trouvé")
        
        print(f"[DEBUG] Utilisateur trouvé : {owner.id}, {owner.email}")

        project = Project(name=name, description=description, owner_id=owner.id)
        session.add(project)
        session.commit()
        session.refresh(project)

        print(f"[DEBUG] Projet créé : id={project.id}, name={project.name}, owner_id={project.owner_id}")
        return project
    except Exception as e:
        print(f"[DEBUG] Erreur lors de la création du projet : {e}")
        raise
    finally:
        session.close()



@mutation.field("createTask")
def resolve_create_task(_, info, title, status, projectId):
    session = SessionLocal()
    try:
        print(f"[DEBUG] Paramètres reçus : title={title}, status={status}, projectId={projectId}")

        project = session.query(Project).filter(Project.id == projectId).first()
        if not project:
            print(f"[DEBUG] Aucun projet trouvé avec l'ID {projectId}")
            raise Exception(f"Le projet avec l'ID {projectId} n'existe pas.")

        task = Task(title=title, status=status, project_id=projectId)
        session.add(task)
        session.commit()
        session.refresh(task)

        print(f"[DEBUG] Tâche créée : id={task.id}, title={task.title}, status={task.status}, projectId={task.project_id}")

        # Retourner l'objet Task directement
        return task
    finally:
        session.close()





@mutation.field("createComment")
def resolve_create_comment(_, info, content, authorId, projectId=None, taskId=None):
    session = SessionLocal()
    try:
        # Vérifiez que l'utilisateur existe
        author = session.query(User).filter(User.id == authorId).first()
        if not author:
            raise Exception(f"Aucun utilisateur trouvé avec l'ID {authorId}")
        
        # Créez le commentaire
        comment = Comment(content=content, author_id=authorId, project_id=projectId, task_id=taskId)
        session.add(comment)
        session.commit()
        session.refresh(comment)
        return comment
    except Exception as e:
        session.rollback()
        raise Exception(f"Erreur lors de la création du commentaire : {str(e)}")
    finally:
        session.close()

@mutation.field("updateComment")
def resolve_update_comment(_, info, id, content):
    session = SessionLocal()
    try:
        comment = session.query(Comment).filter(Comment.id == id).first()
        if not comment:
            raise Exception("Commentaire non trouvé")
        comment.content = content + " (edited)"
        session.commit()
        session.refresh(comment)
        return comment
    finally:
        session.close()

@mutation.field("deleteComment")
def resolve_delete_comment(_, info, id):
    session = SessionLocal()
    try:
        comment = session.query(Comment).filter(Comment.id == id).first()
        if not comment:
            raise Exception("Commentaire non trouvé")
        comment.content = "(commentaire supprimé)"
        session.commit()
        session.refresh(comment)
        return comment
    finally:
        session.close()

@mutation.field("login")
def resolve_login(_, info, email, password):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email).first()
        if not user:
            raise Exception("Email ou mot de passe incorrect")
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise Exception("Email ou mot de passe incorrect")
        token = create_access_token({"sub": user.email, "id": user.id})
        return {"token": token, "user": user}
    finally:
        session.close()


comment_obj = ObjectType("Comment")

@comment_obj.field("author")
def resolve_comment_author(comment, *_):
    session = SessionLocal()
    author = session.query(User).filter(User.id == comment.author_id).first()
    session.close()
    return author

# Ajoutez ce résolveur pour mapper authorId
@comment_obj.field("authorId")
def resolve_comment_authorId(comment, *_):
    return comment.author_id


task_type = ObjectType("Task")

@task_type.field("projectId")
def resolve_task_project_id(task, *_):
    return task.project_id

@mutation.field("updateProject")
def resolve_update_project(_, info, id, name=None, description=None):
    session = SessionLocal()
    try:
        project = session.query(Project).filter(Project.id == id).first()
        if not project:
            raise Exception("Projet non trouvé")
        if name is not None:
            project.name = name
        if description is not None:
            project.description = description
        session.commit()
        session.refresh(project)
        return project
    finally:
        session.close()

@mutation.field("deleteProject")
def resolve_delete_project(_, info, id):
    session = SessionLocal()
    try:
        project = session.query(Project).filter(Project.id == id).first()
        if not project:
            raise Exception("Projet non trouvé")
        session.delete(project)
        session.commit()
        return True
    finally:
        session.close()

@mutation.field("updateUser")
def resolve_update_user(_, info, id, username):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == id).first()
        if not user:
            raise Exception("Utilisateur non trouvé")
        user.username = username
        session.commit()
        session.refresh(user)
        return user
    finally:
        session.close()

@mutation.field("deleteUser")
def resolve_delete_user(_, info, id):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == id).first()
        if not user:
            raise Exception("Utilisateur non trouvé")
        session.delete(user)
        session.commit()
        return True
    finally:
        session.close()

@mutation.field("updateTask")
def resolve_update_task(_, info, id, title=None, status=None):
    session = SessionLocal()
    try:
        id = int(id)  
        task = session.query(Task).filter(Task.id == id).first()
        if not task:
            raise Exception("Tâche non trouvée")
        if title is not None:
            task.title = title
        if status is not None:
            task.status = status
        session.commit()
        session.refresh(task)
        return task
    finally:
        session.close()

@mutation.field("deleteTask")
def resolve_delete_task(_, info, id):
    session = SessionLocal()
    try:
        id = int(id) 
        task = session.query(Task).filter(Task.id == id).first()
        if not task:
            raise Exception("Tâche non trouvée")
        session.delete(task)
        session.commit()
        return True
    finally:
        session.close()