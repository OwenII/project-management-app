//client\src\graphql\queries.js
import { gql } from '@apollo/client';

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