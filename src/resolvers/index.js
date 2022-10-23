const { workspaceQueries, workspaceResolver } = require("./workspace");
const { userQueries, userResolver } = require("./user");
const { conversationQueries, conversationResolver  } = require("./conversation");

const resolvers = [
  ...userResolver,
  ...workspaceResolver,
  ...conversationResolver
];

module.exports = {
  resolvers, userQueries, workspaceQueries, conversationQueries
};
