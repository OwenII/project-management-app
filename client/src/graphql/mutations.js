// client/src/graphql/mutations.js
import { gql } from '@apollo/client';

// Mutation pour créer un projet
export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $ownerId: Int!) {
    createProject(name: $name, description: $description, ownerId: $ownerId) {
      id
      name
      description
      ownerId
    }
  }
`;

// Mutation pour mettre à jour un projet existant
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: Int!, $name: String, $description: String) {
    updateProject(id: $id, name: $name, description: $description) {
      id
      name
      description
      ownerId
    }
  }
`;

// Mutation pour supprimer un projet
export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id)
  }
`;

// Mutation pour mettre à jour une tâche existante
export const UPDATE_TASK = gql`
 mutation UpdateTask($id: Int!, $title: String, $status: String) {
    updateTask(id: $id, title: $title, status: $status) {
     id
     title
     status
     projectId
    }
  }
`;

// Mutation pour supprimer une tâche
export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;

// Mutation pour créer un commentaire
export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($content: String!, $authorId: Int!, $projectId: Int) {
    createComment(content: $content, authorId: $authorId, projectId: $projectId) {
      id
      content
      authorId
    }
  }
`;

// Mutation pour mettre à jour un commentaire
export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: Int!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

// Mutation pour supprimer un commentaire
export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

// Mutation pour l'authentification de l'utilisateur (connexion)
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

// Mutation pour mettre à jour les informations d'un utilisateur
export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $username: String!) {
    updateUser(id: $id, username: $username) {
      id
      username
      email
    }
  }
`;

// Mutation pour supprimer un utilisateur
export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

// Mutation pour créer une nouvelle tâche
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($title: String!, $status: String!, $projectId: Int!) {
    createTask(title: $title, status: $status, projectId: $projectId) {
      id
      title
      status
      projectId
    }
  }
`;

// Mutation pour l'inscription d'un nouvel utilisateur
export const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, username: $username, password: $password) {
      id
      email
      username
    }
  }
`;
