import { gql } from "apollo-server-express";

export const schema = gql`
  type AccountDetails {
    id: ID
    name: String
    email: String
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    accountId: ID
    accountDetails: AccountDetails
  }

  input AddProductInput {
    name: String!
    sku: String!
  }

  input ProductsFilterInput {
    name: String
    sku: String
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  extend type Mutation {
    addProductsToAccount(
      accountId: ID!
      products: [AddProductInput!]!
    ): [Product]
  }

  extend type Query {
    listProducts(
      filter: ProductsFilterInput
      pagination: PaginationInput
    ): [Product]
  }
`;
