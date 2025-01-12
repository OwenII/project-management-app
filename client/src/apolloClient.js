import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from '@apollo/client';

// Création du lien HTTP pour communiquer avec le serveur GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

// Ajout de l'authentification via le token JWT
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Link pour loguer les requêtes et réponses
const logLink = new ApolloLink((operation, forward) => {
  console.log('[DEBUG] GraphQL Request:', operation.operationName, operation.variables);
  
  return forward(operation).map((result) => {
    console.log('[DEBUG] GraphQL Response:', operation.operationName, result);
    return result;
  });
});

// Création de l'instance du client Apollo avec les liens (authentification et log)
const client = new ApolloClient({
  link: ApolloLink.from([authLink, logLink, httpLink]), // Ajouter le logLink ici
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          commentsByProject: {
            keyArgs: ["projectId"],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
