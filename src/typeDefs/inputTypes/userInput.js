const { gql } = require('apollo-server');

const userInput = gql`
  input UserInput {
    email: String! # the same as login
    password: String!
    fullName: String!
  }
`;

module.exports = {
  userInput
};