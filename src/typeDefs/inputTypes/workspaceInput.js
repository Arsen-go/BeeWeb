const { gql } = require('apollo-server');

const workspaceInput = gql`
  input WorkspaceInput {
    name: String!
    emails: [String] #users email
  }
`;

module.exports = {
    workspaceInput
};