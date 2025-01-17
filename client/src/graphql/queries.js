// client\src\graphql\queries.js
import { gql } from '@apollo/client';

// Requête pour obtenir un projet spécifique et ses tâches
export const PROJECT_QUERY = gql`
  query GetProject($id: Int!) {
    project(id: $id) {
      id
      name
      description
      ownerId
    }
    tasks {
      id
      title
      status
      projectId
    }
  }
`;

// Requête pour obtenir toutes les tâches et les projets
export const TASKS_PROJECTS_QUERY = gql`
  query GetTasksAndProjects {
    tasks {
      id
      title
      status
      projectId
    }
    projects {
      id
      ownerId
    }
  }
`;

// Requête pour obtenir les commentaires d'un projet spécifique
export const COMMENTS_QUERY = gql`
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
`;

// Requête pour obtenir tous les projets
export const PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
      id
      name
      description
      ownerId
    }
  }
`;

// Requête pour obtenir les projets avec un filtre optionnel
export const PROJECTS_QUERY_FILTER = gql`
  query GetProjects($filter: String) {
    projects(filter: $filter) {
      id
      name
      description
      ownerId
    }
  }
`;
