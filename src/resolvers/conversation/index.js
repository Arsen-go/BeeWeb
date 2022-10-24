const { Queries } = require("./queries");
const { Mutations } = require("./mutations");
const { gql } = require('apollo-server');
const { conversationValidator } = require("../../validators");
const { conversationRepository, dbRepository } = require("../../repositories");

const conversationResolver = [
    new Queries({ conversationValidator }, { conversationRepository, dbRepository }),
    new Mutations({ conversationValidator }, { conversationRepository, dbRepository }),
];


const conversationQueries = gql`
    type Query {
        userConversations (filter: FilterInput!): [Conversation]
    }

    type Mutation {
        createConversation (conversation: ConversationInput!): Conversation
        """Invite with user id because user is already will be registered in the application"""
        inviteUserToConversation (conversationId: String!, userId: String!): String
        acceptConversationInvite (conversationId: String!): Conversation
    }
`;

module.exports = { conversationResolver, conversationQueries };