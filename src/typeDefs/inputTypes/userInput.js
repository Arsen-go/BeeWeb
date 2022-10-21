const { gql } = require('apollo-server');

const userInput = gql`
  input UserInput {
    email: String!
    name: String!
    birthDay: String
  }
`;

module.exports = {
  userInput
};