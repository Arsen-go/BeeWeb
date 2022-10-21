const { tableQueries, tableResolver } = require("./table");

const resolvers = [
  ...tableResolver
];

module.exports = {
  resolvers, tableQueries
};
