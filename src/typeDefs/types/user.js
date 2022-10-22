const { gql } = require('apollo-server');

const user = gql `
  scalar Date
  type User {
      id: String
      fullName: String
      email: String
      createdAt: Date
  }
`;

module.exports = {
    user,
};