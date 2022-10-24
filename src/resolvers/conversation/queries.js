const { authentication } = require("../../authentication");

let conversationRepository, dbRepository, conversationValidator;
class Queries {
    constructor(validators, repositories) {
        conversationValidator = validators.conversationValidator;
        conversationRepository = repositories.conversationRepository;
        dbRepository = repositories.dbRepository;
    }

    Query = {
        userConversations: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await conversationValidator.validateFilter(requestBody);
                return await conversationRepository.userConversations(requestBody, currentUser);
            }),
    };

    Conversation = {
        users: async (conversation) => await dbRepository.getUsers({ _id: conversation.users }, {}, {}),

        files: async (conversation) => await dbRepository.getAttachments({ _id: conversation.files }, {}, {}),

        owner: async (conversation) => await dbRepository.getUser({ _id: conversation.owner }),

        invites: async (conversation) => await dbRepository.getInvites({ workspace: conversation._id }, {}, {}),

        workspace: async (conversation) => await dbRepository.getWorkspace({ _id: conversation.workspace }),
    };

    Invite = {
        workspace: async (invite) => await dbRepository.getWorkspace({ _id: invite.workspace }),

        conversation: async (invite) => await dbRepository.getConversation({ _id: invite.conversation }),

        from: async (conversation) => await dbRepository.getUser({ _id: conversation.owner }),
    };
}

module.exports = { Queries };