const { Queries } = require("./queries");
const { Mutations } = require("./mutations")
const { gql } = require('apollo-server');
const { userValidator } = require("../../validators");
const { userRepository, dbRepository } = require("../../repositories");

const tableResolver = [
    new Queries({ userValidator }, { userRepository, dbRepository }),
    new Mutations({ userValidator }, { userRepository, dbRepository }),
];


const tableQueries = gql`
    type Query {
        users (limit: Float!, skip: Float): [User]
    }

    type Mutation {
        """This is for creating a user"""
        createUser (user: UserInput!): User
    }
  
`

module.exports = { tableResolver, tableQueries };