const { gql } = require('apollo-server');

const conversationInput = gql`
  input ConversationInput {
    name: String
    workspaceId: String
    userIds: [String]  # existing users id's
  }
`;

module.exports = {
    conversationInput
};