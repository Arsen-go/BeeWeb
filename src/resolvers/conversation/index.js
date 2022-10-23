// const { Queries } = require("./queries");
const { Mutations } = require("./mutations");
const { gql } = require('apollo-server');
const { conversationValidator } = require("../../validators");
const { conversationRepository, dbRepository } = require("../../repositories");

const conversationResolver = [
    // new Queries({ conversationValidator }, { conversationRepository, dbRepository }),
    new Mutations({ conversationValidator }, { conversationRepository, dbRepository }),
];


const conversationQueries = gql`
    type Mutation {
        createConversation (conversation: ConversationInput!): Conversation
        acceptConversationInvite (conversationId: String!): Conversation
    }
`;

module.exports = { conversationResolver, conversationQueries };