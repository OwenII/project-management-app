import { gql } from '@apollo/client';

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
