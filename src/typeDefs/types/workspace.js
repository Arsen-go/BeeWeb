

const { gql } = require('apollo-server');

const workspace = gql`
    type Workspace {
        id: String!
        owner: User!
        name: String
        createdAt: Date
        invites: [Invite]
        users: [User]
        files: [Attachment]
    }
`;

module.exports = {
    workspace,
};
