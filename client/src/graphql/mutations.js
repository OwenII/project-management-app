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
