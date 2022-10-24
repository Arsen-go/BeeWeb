const { user, token, workspace, conversation, invite, attachment } = require('./types');
const { userInput, workspaceInput, filterInput, conversationInput } = require("./inputTypes");
const { userQueries, workspaceQueries, conversationQueries } = require("../resolvers");

const typeDefs = [
    user, token, workspace, conversation, invite, attachment,
    userInput, workspaceInput, filterInput, conversationInput,
    userQueries, workspaceQueries, conversationQueries
];

module.exports = {
    typeDefs,
};