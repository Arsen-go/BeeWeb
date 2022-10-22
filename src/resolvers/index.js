const { workspaceQueries, workspaceResolver } = require("./workspace");
const { userQueries, userResolver } = require("./user");

const resolvers = [
  ...userResolver,
  ...workspaceResolver,
];

module.exports = {
  resolvers, userQueries, workspaceQueries
};
