const { gql } = require('apollo-server');

const user = gql `
scalar Date
  type User {
      id: String
      name: String
      email: String
      createdAt: Date
      birthDay: Date
  }
`;

module.exports = {
    user,
};