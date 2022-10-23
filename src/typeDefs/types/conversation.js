const { gql } = require("apollo-server");

const conversation = gql`
  type Conversation {
    id: String!
    name: Int!
    # users: String!
    # workspace: Int!
  }
`;

module.exports = {
    conversation,
};
