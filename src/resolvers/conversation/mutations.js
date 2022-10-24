const { authentication } = require("../../authentication");

let conversationValidator, conversationRepository;
class Mutations {
    constructor(validators, repositories) {
        conversationValidator = validators.conversationValidator;
        conversationRepository = repositories.conversationRepository;
    }

    Mutation = {
        createConversation: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await conversationValidator.validateCreateConversation(requestBody);
                return await conversationRepository.createConversation(requestBody, currentUser);
            }),

        inviteUserToConversation: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await conversationValidator.validateInviteUserToConversation(requestBody);
                return await conversationRepository.inviteUserToConversation(requestBody, currentUser);
            }),

        acceptConversationInvite: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await conversationValidator.validateAcceptConversationInvite(requestBody);
                return await conversationRepository.acceptConversationInvite(requestBody, currentUser);
            }),
    };
}

module.exports = { Mutations };