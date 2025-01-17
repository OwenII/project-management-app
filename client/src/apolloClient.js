import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Crée un lien HTTP pour se connecter au serveur GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql', // URL de votre serveur GraphQL
});

// Crée un lien de contexte pour ajouter le token d'authentification aux en-têtes
const authLink = setContext((_, { headers }) => {
  // Récupère le token d'authentification stocké dans le localStorage
  const token = localStorage.getItem('token');

  // Ajoute le token dans les en-têtes de la requête si disponible
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Si un token est trouvé, on l'ajoute sous forme de Bearer token
    }
  };
});

// Crée une instance du client Apollo en combinant authLink et httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chaîne les liens d'authentification et de communication HTTP
  cache: new InMemoryCache(), // Utilise un cache en mémoire pour stocker les données GraphQL
});

export default client; // Exporte le client Apollo pour l'utiliser dans l'application
