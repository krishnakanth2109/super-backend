const schema = `
  type User {
    id: ID!
    firebaseUid: String!
    name: String!
    phone: String
    email: String!
    createdAt: String
  }

  input UserInput {
    name: String!
    phone: String!
  }

  type Query {
    me: User
    protectedData: String
  }

  type Mutation {
    createUser(input: UserInput!): User
  }
`;

export default schema;