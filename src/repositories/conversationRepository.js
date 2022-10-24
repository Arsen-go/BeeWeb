const { ApolloError } = require("apollo-server-express");
const { translate } = require("../locales");
const { logger } = require("../logger");

class ConversationRepository {
    constructor(dbRepository, mailRepository, pubsub) {
        this.dbRepository = dbRepository;
        this.mailRepository = mailRepository;
        // eslint-disable-next-line no-undef
        this.defaultLanguage = process.env.DEFAULT_LANGUAGE;
        this.pubsub = pubsub;
    }

    async createConversation(requestBody, currentUser) {
        const { conversation } = requestBody;
        try {
            const { name, workspaceId, userIds } = conversation;
            const user = await this.dbRepository.getUser({ id: currentUser.id });

            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId }, { _id: 1 });
            if (!workspace) throw translate("Workspace is not found.", this.defaultLanguage);

            const createdConversation = await this.dbRepository.createConversation({
                owner: user._id,
                name,
                workspace: workspace._id
            });

            if (userIds && userIds.length) {
                this.#inviteUsersToConversation(userIds, user, createdConversation);
            }

            return createdConversation;
        } catch (error) {
            logger.error(`Error ${new Date()}: createConversation() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async inviteUserToConversation(requestBody, currentUser) {
        const { conversationId, userId } = requestBody;
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const conversation = await this.dbRepository.getConversation({ id: conversationId });
            if (!conversation) throw translate("Conversation is not exist.", "US");
            const inviteTo = await this.dbRepository.getUser({ id: userId });
            if (!inviteTo) throw translate("User is not found.", "US");

            // if user invited to the conversation without being in the workspace member.
            const workspace = await this.dbRepository.getWorkspace({ _id: conversation.workspace });
            if (!workspace) throw translate("This conversation is not valid.", "US");
            await this.dbRepository.updateWorkspace({ _id: workspace._id }, { $push: { users: inviteTo._id } });

            const invite = await this.dbRepository.createInvite({
                from: user._id,
                to: inviteTo.email,
                inviteType: "CONVERSATION",
                conversation: conversation._id
            });

            this.#inviteUsersToConversation([userId], user, conversation);
            this.pubsub.publish("invitationListener", { invitationListener: invite, user: inviteTo });

            return "";
        } catch (error) {
            logger.error(`Error# ${new Date()}: inviteUserToWorkspace() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async acceptConversationInvite(requestBody, currentUser) {
        const { conversationId } = requestBody;

        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const conversation = await this.dbRepository.getConversation({ id: conversationId });
            const invite = await this.dbRepository.getInvite({ to: currentUser.email, conversation: conversation._id }, { conversation: 1, _id: 1 });
            if (!invite) throw translate("You are not invited to this conversation.", this.defaultLanguage);
            await this.dbRepository.updateConversation({ _id: invite.conversation }, { $push: { users: user._id } });
            await this.dbRepository.deleteInvite({ conversation: conversation._id, to: user.email });
            return conversation;
        } catch (error) {
            logger.error(`Error# ${new Date()}: acceptConversationInvite() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async userConversations(requestBody, currentUser) {
        const { filter } = requestBody;
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            return await this.dbRepository.getConversations({
                $or: [{ owner: user._id }, { users: user._id }]
            }, {}, filter);
        } catch (error) {
            logger.error(`Error# ${new Date()}: userConversations() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    #inviteUsersToConversation(userIds, currentUser, conversation) {
        try {
            for (const id of userIds) {
                this.mailRepository.inviteUserToConversation(id, currentUser, conversation);
            }
        } catch (error) {
            logger.error(`Error# ${new Date()}: inviteUsersToConversation() failed \n ${error}`);
        }
    }
}

module.exports = ConversationRepository;