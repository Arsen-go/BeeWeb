

const { gql } = require('apollo-server');

const workspace = gql`
    type Workspace {
        id: String!
        #owner: User!
        name: String
        createdDate: Date
        #invites: [Invite]
        #allInvites: [Invite]
        users: [User]
        #files: [Attachment]
    }
`;

module.exports = {
    workspace,
};
