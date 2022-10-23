const { Queries } = require("./queries");
const { Mutations } = require("./mutations");
const { gql } = require('apollo-server');
const { userValidator } = require("../../validators");
const { userRepository, dbRepository } = require("../../repositories");

const userResolver = [
    new Queries({ userValidator }, { userRepository, dbRepository }),
    new Mutations({ userValidator }, { userRepository, dbRepository }),
];


const userQueries = gql`
    type Query {
        """Get current token user with this api."""
        me: User!
    }

    type Mutation {
        """Step 1: After calling this api user gets a verification code."""
        verifyEmail (email: String!): String
        """Step 2: Check if the code is true with this email address or not."""
        confirmCode (confirmationCode: String!, email: String!): String
        """Step 3: Register a new user and get application token."""
        createUser (user: UserInput!): Token
        login (email: String!, password: String!): Token
    }
  
`;

module.exports = { userResolver, userQueries };