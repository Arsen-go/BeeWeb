const { gql } = require('apollo-server');

const filterInput = gql`
  input FilterInput {
    limit: Int!
    skip: Int
  }
`;

module.exports = {
    filterInput
};