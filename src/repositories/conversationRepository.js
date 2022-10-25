const { ApolloError } = require("apollo-server-express");
const { db } = require("../database/mongodb"); // if database is selected postgresql we will do transaction with that but now i can't deliver that (կարճ ասած չեմ հասցնի -_-;d)  
const { translate } = require("../locales");
const { logger } = require("../logger");

class ConversationRepository {
    constructor(dbRepository, mailRepository, pubsub) {
        this.dbRepository = dbRepository;
        this.mailRepository = mailRepository;
        // eslint-disable-next-line no-undef
        this.defaultLanguage = process.env.DEFAULT_LANGUAGE;
        this.pubsub = pubsub;
        this.transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
    }

    async createConversation(requestBody, currentUser) {
        const { conversation } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);
            const { name, workspaceId, userIds } = conversation;
            const user = await this.dbRepository.getUser({ id: currentUser.id });

            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId }, { _id: 1 });
            if (!workspace) throw translate("Workspace is not found.", this.defaultLanguage);

            const createdConversation = await this.dbRepository.createConversation({
                owner: user._id,
                name,
                workspace: workspace._id
            }, session);

            if (userIds && userIds.length) {
                this.#inviteUsersToConversation(userIds, user, createdConversation);
            }

            await session.commitTransaction();

            return createdConversation;
        } catch (error) {
            logger.error(`Error ${new Date()}: createConversation() \n ${error}`);
            await session.abortTransaction();
            throw new ApolloError(error);
        } finally {
            await session.endSession();
        }
    }

    async inviteUserToConversation(requestBody, currentUser) {
        const { conversationId, userId } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);

            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const conversation = await this.dbRepository.getConversation({ id: conversationId });
            if (!conversation) throw translate("Conversation is not exist.", "US");
            const inviteTo = await this.dbRepository.getUser({ id: userId });
            if (!inviteTo) throw translate("User is not found.", "US");

            // if user invited to the conversation without being in the workspace member.
            const workspace = await this.dbRepository.getWorkspace({ _id: conversation.workspace });
            if (!workspace) throw translate("This conversation is not valid.", "US");
            await this.dbRepository.updateWorkspace({ _id: workspace._id }, { $push: { users: inviteTo._id } }, session);

            const isSend = await this.mailRepository.inviteUserToConversation(userId, user, conversation);
            const isInvited = await this.dbRepository.getInvite({ to: inviteTo.email });

            let invite = {};
            if (isSend && !isInvited) {
                invite = await this.dbRepository.createInvite({
                    from: user._id,
                    to: inviteTo.email,
                    inviteType: "CONVERSATION",
                    conversation: conversation._id
                }, session);
            }

            this.pubsub.publish("invitationListener", { invitationListener: invite, user: inviteTo });

            await session.commitTransaction();
            return "";
        } catch (error) {
            logger.error(`Error# ${new Date()}: inviteUserToWorkspace() \n ${error}`);
            await session.abortTransaction();
            throw new ApolloError(error);
        } finally {
            await session.endSession();
        }
    }

    async acceptConversationInvite(requestBody, currentUser) {
        const { conversationId } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const conversation = await this.dbRepository.getConversation({ id: conversationId });
            const invite = await this.dbRepository.getInvite({ to: currentUser.email, conversation: conversation._id }, { conversation: 1, _id: 1 });
            if (!invite) throw translate("You are not invited to this conversation.", this.defaultLanguage);
            await this.dbRepository.updateConversation({ _id: invite.conversation }, { $push: { users: user._id } }, session);
            await this.dbRepository.deleteInvite({ conversation: conversation._id, to: user.email }, session);
            await session.commitTransaction();

            return conversation;
        } catch (error) {
            logger.error(`Error# ${new Date()}: acceptConversationInvite() \n ${error}`);
            await session.abortTransaction();
            throw new ApolloError(error);
        } finally {
            await session.endSession();
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

    async #inviteUsersToConversation(userIds, currentUser, conversation) {
        try {
            for (const id of userIds) {
                const isSend = await this.mailRepository.inviteUserToConversation(id, currentUser, conversation);
                if (isSend) {
                    const isInvited = await this.dbRepository.getInvite({ to: currentUser.email });
                    if (!isInvited) {
                        await this.dbRepository.createInvite({
                            from: currentUser._id,
                            to: currentUser.email,
                            inviteType: "CONVERSATION",
                            conversation: conversation._id
                        });
                    }
                }
            }
        } catch (error) {
            logger.error(`Error# ${new Date()}: inviteUsersToConversation() failed \n ${error}`);
        }
    }
}

module.exports = ConversationRepository;