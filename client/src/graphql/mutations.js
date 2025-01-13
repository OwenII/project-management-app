//client\src\graphql\mutations.js
import { gql } from '@apollo/client';

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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id)
  }
`;

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

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
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