import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    firebaseUid: String!
    email: String!
    name: String!
    phoneNumber: String
    createdAt: String
  }

  # Define the input type for our mutation
  input UserProfileInput {
    name: String
    phoneNumber: String
  }

  type Query {
    me: User
  }

  type Mutation {
    # Update the mutation to accept the input type
    syncUserProfile(profile: UserProfileInput): User
  }
`;