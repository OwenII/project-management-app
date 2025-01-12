from ariadne import QueryType, MutationType, ObjectType
from .database import SessionLocal
from .models import User, Project, Task, Comment
from sqlalchemy.exc import IntegrityError
from .auth import create_access_token
import bcrypt 
query = QueryType()
mutation = MutationType()

# Résolveurs pour les Query
@query.field("projects")
def resolve_projects(*_):
    session = SessionLocal()
    projects = session.query(Project).all()
    print(f"[DEBUG] Projets renvoyés : {[{'id': p.id, 'name': p.name, 'owner_id': p.owner_id} for p in projects]}")
    session.close()
    return projects

@query.field("project")
def resolve_project(*_, id):
    session = SessionLocal()
    project = session.query(Project).filter(Project.id == id).first()
    print(f"[DEBUG] Projet demandé : {project}")
    session.close()
    return project

@query.field("tasks")
def resolve_tasks(*_):
    session = SessionLocal()
    tasks = session.query(Task).all()
    task_data = [
        {
            'id': t.id,
            'title': t.title,
            'status': t.status,
            'projectId': t.project_id  
        } for t in tasks
    ]
    print(f"[DEBUG] Toutes les tâches récupérées : {task_data}")
    session.close()
    return task_data



@query.field("task")
def resolve_task(*_, id):
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == id).first()
    if task:
        task_data = {
            'id': task.id,
            'title': task.title,
            'status': task.status,
            'projectId': task.project_id  
        }
        print(f"[DEBUG] Tâche demandée : {task_data}")
        session.close()
        return task_data
    print("[DEBUG] Tâche non trouvée")
    session.close()
    return None

@query.field("users")
def resolve_users(*_):
    session = SessionLocal()
    users = session.query(User).all()
    print(f"[DEBUG] Utilisateurs renvoyés : {[{'id': u.id, 'email': u.email} for u in users]}")
    session.close()
    return users

@query.field("user")
def resolve_user(*_, id):
    session = SessionLocal()
    user = session.query(User).filter(User.id == id).first()
    print(f"[DEBUG] Utilisateur demandé : {user}")
    session.close()
    return user

# Résolveur explicite pour ownerId
project_type = ObjectType("Project")

@project_type.field("ownerId")
def resolve_project_owner_id(project, *_):
    print(f"[DEBUG] Résolution de ownerId pour le projet {project.id}")
    return project.owner_id

# server/app/resolvers.py
@mutation.field("createUser")
def resolve_create_user(_, info, email, username, password):
    import bcrypt
    session = SessionLocal()
    try:
        # Vérification d'email ou pseudo existants
        existing_user = session.query(User).filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            raise Exception("L'email ou le pseudo est déjà utilisé.")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(email=email, username=username, password=hashed_password)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    except IntegrityError:
        session.rollback()
        raise Exception("Erreur lors de la création de l'utilisateur.")
    finally:
        session.close()


@mutation.field("createProject")
def resolve_create_project(_, info, name, description, ownerId):
    session = SessionLocal()
    try:
        owner = session.query(User).filter(User.id == ownerId).first()
        if not owner:
            print(f"[DEBUG] Utilisateur non trouvé pour ownerId : {ownerId}")
            raise Exception("Utilisateur non trouvé")
        project = Project(name=name, description=description, owner_id=owner.id)
        session.add(project)
        session.commit()
        session.refresh(project)
        print(f"[DEBUG] Projet créé : {project}")
        return project
    finally:
        session.close()

@mutation.field("createTask")
def resolve_create_task(_, info, title, status, projectId):
    session = SessionLocal()
    try:
        task = Task(title=title, status=status, project_id=projectId)
        session.add(task)
        session.commit()
        session.refresh(task)
        print(f"[DEBUG] Tâche créée : {task}")
        return {
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "projectId": task.project_id,
        }
    finally:
        session.close()


@mutation.field("createComment")
def resolve_create_comment(_, info, content, authorId, projectId=None, taskId=None):
    session = SessionLocal()
    try:
        # Vérification de l'existence de l'utilisateur
        author = session.query(User).filter(User.id == authorId).first()
        if not author:
            raise Exception(f"Aucun utilisateur trouvé avec l'ID {authorId}")
        
        # Créer le commentaire
        comment = Comment(content=content, author_id=authorId, project_id=projectId, task_id=taskId)
        session.add(comment)
        session.commit()
        session.refresh(comment)
        
        print(f"[DEBUG] Commentaire créé : id={comment.id}, content={comment.content}, authorId={comment.author_id}")
        
        # Retourner un dictionnaire avec un authorId explicite
        return {
            'id': comment.id,
            'content': comment.content,
            'authorId': comment.author_id,
            'projectId': comment.project_id,
            'taskId': comment.task_id,
        }
    except Exception as e:
        session.rollback()
        raise Exception(f"Erreur lors de la création du commentaire: {str(e)}")
    finally:
        session.close()




@mutation.field("login")
def resolve_login(_, info, email, password):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email).first()
        if not user:
            print(f"[DEBUG] Aucun utilisateur trouvé avec l'email : {email}")
            raise Exception("Identifiants invalides")
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            print(f"[DEBUG] Mot de passe incorrect pour l'utilisateur : {email}")
            raise Exception("Identifiants invalides")
        token = create_access_token({"sub": user.email, "id": user.id})
        print(f"[DEBUG] Connexion réussie pour : {email}")
        return {"token": token, "user": user}
    finally:
        session.close()



task_type = ObjectType("Task")

@task_type.field("projectId")
def resolve_task_project_id(task, *_):
    if task.project_id is None:
        print(f"[DEBUG] Tâche avec un project_id nul détectée : {task}")
    return task.project_id

@query.field("commentsByProject")
def resolve_comments_by_project(*_, projectId):
    session = SessionLocal()
    comments = session.query(Comment).filter(Comment.project_id == projectId).all()
    session.close()
    return comments

comment_obj = ObjectType("Comment")

@comment_obj.field("author")
def resolve_comment_author(comment_obj, *_):
    session = SessionLocal()
    try:
        author = session.query(User).filter(User.id == comment_obj.author_id).first()
        if not author:
            print(f"[DEBUG] Aucune correspondance pour author_id={comment_obj.author_id}")
            return None
        return author
    finally:
        session.close()
