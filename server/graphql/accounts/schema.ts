import { gql } from "apollo-server-express";

export const schema = gql`
  input CreateAccountInput {
    name: String!
    email: String!
  }

  type Account {
    id: ID!
    name: String
    email: String
    createdAt: String
    updatedAt: String
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    createdAt: String
    updatedAt: String
  }

  input AccountsFilterInput {
    name: String
    email: String
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): Account
  }

  extend type Query {
    listAccounts(
      filter: AccountsFilterInput
      pagination: PaginationInput
    ): [Account]
  }
`;
