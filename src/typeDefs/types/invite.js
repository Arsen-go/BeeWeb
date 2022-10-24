const { gql } = require("apollo-server");

const invite = gql`
  type Invite {
    id: String
    inviteType: String # workspace or conversation
    from: User
    to: String # because still may be not exist in app
    createdAt: Date
    workspace: Workspace
    conversation: Conversation
  }
`;

module.exports = {
    invite,
};
