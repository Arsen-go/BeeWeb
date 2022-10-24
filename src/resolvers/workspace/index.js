const { Queries } = require("./queries");
const { Mutations } = require("./mutations");
const { Subscriptions } = require("./subscription");
const { gql } = require('apollo-server');
const { workspaceValidator } = require("../../validators");
const { workspaceRepository, dbRepository, pubsub } = require("../../repositories");

const workspaceResolver = [
    new Queries({ workspaceValidator }, { workspaceRepository, dbRepository }),
    new Mutations({ workspaceValidator }, { workspaceRepository, dbRepository }),
    new Subscriptions({}, { dbRepository }, pubsub),
];


const workspaceQueries = gql`
    type Subscription {
        """Inform user about invitation real time"""
        invitationListener: Invite
    }

    type Query {
        userWorkspaces (filter: FilterInput!): [Workspace]
    }

    type Mutation {
        createWorkspace (workspace: WorkspaceInput!): Workspace
        inviteUserToWorkspace (workspaceId: String!, emailAddress: String!): String
        """If user is already registered. In other case we will accept invite inside createUser"""
        acceptWorkspaceInvite (workspaceId: String!): Workspace
    }
`;

module.exports = { workspaceResolver, workspaceQueries };