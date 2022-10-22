const { user, token, workspace } = require('./types');
const { userInput, workspaceInput, filterInput } = require("./inputTypes");
const { userQueries, workspaceQueries } = require("../resolvers");

const typeDefs = [
    user, token, workspace,
    userInput, workspaceInput, filterInput,
    userQueries, workspaceQueries
];

module.exports = {
    typeDefs,
};