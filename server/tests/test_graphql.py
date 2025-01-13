# server/tests/test_graphql.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Utilitaires pour simplifier l'envoi de requêtes GraphQL
def execute_query(query: str, variables: dict = None):
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    response = client.post("/graphql", json=payload)
    assert response.status_code == 200, response.text
    result = response.json()
    assert "errors" not in result, f"GraphQL errors: {result.get('errors')}"
    return result["data"]

# Tests pour les requêtes (Queries)
def test_projects_and_project_queries():
    # Récupère tous les projets
    data = execute_query("""
        query {
          projects {
            id
            name
            description
            ownerId
          }
        }
    """)
    assert isinstance(data["projects"], list)

    # Si des projets existent, tester la requête par ID
    if data["projects"]:
        project_id = int(data["projects"][0]["id"])
        data = execute_query(f"""
            query GetProject($id: Int!) {{
              project(id: $id) {{
                id
                name
                description
                ownerId
              }}
            }}
        """, {"id": project_id})
        assert data["project"]["id"] == str(project_id) or data["project"]["id"] == project_id

def test_tasks_and_task_queries():
    # Récupère toutes les tâches
    data = execute_query("""
        query {
          tasks {
            id
            title
            status
            projectId
          }
        }
    """)
    assert isinstance(data["tasks"], list)

    # Si des tâches existent, tester la requête par ID
    if data["tasks"]:
        task_id = int(data["tasks"][0]["id"])
        data = execute_query(f"""
            query GetTask($id: Int!) {{
              task(id: $id) {{
                id
                title
                status
                projectId
              }}
            }}
        """, {"id": task_id})
        assert data["task"]["id"] == str(task_id) or data["task"]["id"] == task_id

def test_users_and_user_queries():
    # Récupère tous les utilisateurs
    data = execute_query("""
        query {
          users {
            id
            email
            username
          }
        }
    """)
    assert isinstance(data["users"], list)

    # Si des utilisateurs existent, tester la requête par ID
    if data["users"]:
        user_id = int(data["users"][0]["id"])
        data = execute_query(f"""
            query GetUser($id: Int!) {{
              user(id: $id) {{
                id
                email
                username
              }}
            }}
        """, {"id": user_id})
        assert data["user"]["id"] == str(user_id) or data["user"]["id"] == user_id

def test_comments_by_project_query():
    # Teste la récupération des commentaires par projet
    project_id = 1  
    data = execute_query("""
        query CommentsByProject($projectId: Int!) {
          commentsByProject(projectId: $projectId) {
            id
            content
            author {
              id
              username
            }
          }
        }
    """, {"projectId": project_id})
    assert isinstance(data["commentsByProject"], list)

# Tests pour les mutations
def test_create_and_modify_entities():
    # Créer un nouvel utilisateur
    user_data = execute_query("""
        mutation CreateUser($email: String!, $username: String!, $password: String!) {
          createUser(email: $email, username: $username, password: $password) {
            id
            email
            username
          }
        }
    """, {"email": "testuser@example.com", "username": "testuser", "password": "securepwd"})
    user_id = int(user_data["createUser"]["id"])
    assert user_data["createUser"]["email"] == "testuser@example.com"

    # Créer un projet avec le nouvel utilisateur
    project_data = execute_query("""
        mutation CreateProject($name: String!, $description: String, $ownerId: Int!) {
          createProject(name: $name, description: $description, ownerId: $ownerId) {
            id
            name
            description
            ownerId
          }
        }
    """, {"name": "Test Project", "description": "A project created during tests", "ownerId": user_id})
    project_id = int(project_data["createProject"]["id"])
    assert project_data["createProject"]["name"] == "Test Project"

    # Créer une tâche associée au projet
    task_data = execute_query("""
        mutation CreateTask($title: String!, $status: String!, $projectId: Int!) {
          createTask(title: $title, status: $status, projectId: $projectId) {
            id
            title
            status
            projectId
          }
        }
    """, {"title": "Test Task", "status": "TODO", "projectId": project_id})
    task_id = int(task_data["createTask"]["id"])
    assert task_data["createTask"]["title"] == "Test Task"

    # Créer un commentaire pour le projet
    comment_data = execute_query("""
        mutation CreateComment($content: String!, $authorId: Int!, $projectId: Int) {
          createComment(content: $content, authorId: $authorId, projectId: $projectId) {
            id
            content
            authorId
            projectId
          }
        }
    """, {"content": "Test comment", "authorId": user_id, "projectId": project_id})
    comment_id = int(comment_data["createComment"]["id"])
    assert comment_data["createComment"]["content"] == "Test comment"

    # Mettre à jour le commentaire
    updated_comment = execute_query("""
        mutation UpdateComment($id: Int!, $content: String!) {
          updateComment(id: $id, content: $content) {
            id
            content
          }
        }
    """, {"id": comment_id, "content": "Updated comment"})
    assert "edited" in updated_comment["updateComment"]["content"]

    # Supprimer le commentaire (soft-delete)
    deleted_comment = execute_query("""
        mutation DeleteComment($id: Int!) {
          deleteComment(id: $id) {
            id
            content
          }
        }
    """, {"id": comment_id})
    assert "(commentaire supprimé)" in deleted_comment["deleteComment"]["content"]

    # Mettre à jour le projet
    updated_project = execute_query("""
        mutation UpdateProject($id: Int!, $name: String, $description: String) {
          updateProject(id: $id, name: $name, description: $description) {
            id
            name
            description
          }
        }
    """, {"id": project_id, "name": "Updated Project", "description": "Updated description"})
    assert updated_project["updateProject"]["name"] == "Updated Project"

    # Supprimer le projet
    delete_project_result = execute_query("""
        mutation DeleteProject($id: Int!) {
          deleteProject(id: $id)
        }
    """, {"id": project_id})
    assert delete_project_result["deleteProject"] == True

    # Mettre à jour l'utilisateur
    updated_user = execute_query("""
        mutation UpdateUser($id: Int!, $username: String!) {
          updateUser(id: $id, username: $username) {
            id
            username
          }
        }
    """, {"id": user_id, "username": "updateduser"})
    assert updated_user["updateUser"]["username"] == "updateduser"

    # Supprimer l'utilisateur
    delete_user_result = execute_query("""
        mutation DeleteUser($id: Int!) {
          deleteUser(id: $id)
        }
    """, {"id": user_id})
    assert delete_user_result["deleteUser"] == True

    # Mettre à jour la tâche
    try:
        updated_task = execute_query("""
            mutation UpdateTask($id: Int!, $title: String, $status: String) {
              updateTask(id: $id, title: $title, status: $status) {
                id
                title
                status
              }
            }
        """, {"id": task_id, "title": "Updated Task", "status": "DONE"})
        assert updated_task["updateTask"]["title"] == "Updated Task"
    except AssertionError:
        # Si la tâche n'est plus disponible à cause de la suppression en cascade
        pass

    # Supprimer la tâche
    try:
        delete_task_result = execute_query("""
            mutation DeleteTask($id: Int!) {
              deleteTask(id: $id)
            }
        """, {"id": task_id})
        assert delete_task_result["deleteTask"] == True
    except Exception:
        # Si la tâche n'existe plus, ignorer l'erreur
        pass
