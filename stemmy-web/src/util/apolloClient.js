import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: process.env.GATSBY_GQL_URL,
  cache: new InMemoryCache(),
})
