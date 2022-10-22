const { Queries } = require("./queries");
const { Mutations } = require("./mutations")
const { gql } = require('apollo-server');
const { workspaceValidator } = require("../../validators");
const { workspaceRepository, dbRepository } = require("../../repositories");

const workspaceResolver = [
    new Queries({ workspaceValidator }, { workspaceRepository, dbRepository }),
    new Mutations({ workspaceValidator }, { workspaceRepository, dbRepository }),
];


const workspaceQueries = gql`
    type Query {
        userWorkspaces (filter: FilterInput!): [Workspace]
    }

    type Mutation {
        createWorkspace (workspace: WorkspaceInput!): Workspace
    }
`

module.exports = { workspaceResolver, workspaceQueries };