const { gql } = require("apollo-server");

const conversation = gql`
  type Conversation {
    id: String!
    name: String
    owner: User
    files: [Attachment]
    users: [User]
    workspace: Workspace
    invites: [Invite]
    createdAt: Date
  }
`;

module.exports = {
    conversation,
};
