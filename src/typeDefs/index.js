const { user } = require('./types');
const { userInput } = require("./inputTypes");
const { tableQueries } = require("../resolvers");

const typeDefs = [
    user,
    userInput,
    tableQueries,
];

module.exports = {
    typeDefs,
};