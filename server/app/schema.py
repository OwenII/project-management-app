#server\app\schema.py
from ariadne import make_executable_schema
from .resolvers import query, mutation, project_type, comment_obj

type_defs = """
    type User {
        id: ID!
        email: String!
        username: String!
    }

    type Project {
        id: ID!
        name: String!
        description: String
        ownerId: Int!
    }

    type Task {
        id: ID!
        title: String!
        status: String!
        projectId: Int
    }

    type Comment {
        id: ID!
        content: String!
        authorId: Int!
        projectId: Int
        taskId: Int
        author: User   
    }

    type LoginResult {
        token: String!
        user: User!
    }

    type Query {
        projects: [Project!]!
        project(id: Int!): Project
        tasks: [Task!]!
        task(id: Int!): Task
        users: [User!]!
        user(id: Int!): User
        commentsByProject(projectId: Int!): [Comment!]!
    }

    type Mutation {
        login(email: String!, password: String!): LoginResult!
        createProject(name: String!, description: String, ownerId: Int!): Project!
        createTask(title: String!, status: String!, projectId: Int!): Task!
        createComment(content: String!, authorId: Int!, projectId: Int, taskId: Int): Comment!
        createUser(email: String!, username: String!, password: String!): User!
    }
"""

schema = make_executable_schema(type_defs, [query, mutation, project_type, comment_obj])
