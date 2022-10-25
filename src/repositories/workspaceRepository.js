const { ApolloError } = require("apollo-server-core");
const { db } = require("../database/mongodb");
const { translate } = require("../locales");
const { logger } = require("../logger");

class WorkSpaceRepository {
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

    async createWorkspace(requestBody, currentUser) {
        const { workspace } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);

            const { emails, name } = workspace;
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const createdWorkspace = await this.dbRepository.createWorkspace({
                owner: user._id,
                name,
                slag: name.replace(/\s/g, '').toLowerCase()
            }, session);

            // Invitations with nodeMailer also we can do that with twillo
            this.#sendWorkspaceInvitationsWithEmail(createdWorkspace, emails, user);
            await session.commitTransaction();

            return createdWorkspace;
        } catch (error) {
            await session.abortTransaction();
            logger.error(`Error# ${new Date()}: createWorkspace() \n ${error}`);
            throw new ApolloError(error);
        } finally {
            await session.endSession();
        }
    }

    async inviteUserToWorkspace(requestBody, currentUser) {
        const { workspaceId, emailAddress } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);

            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId });
            if (!workspace) throw translate("Workspace is not exist.", "US");
            const inviteTo = await this.dbRepository.getUser({ email: emailAddress });
            const isSend = await this.mailRepository.inviteUserToWorkspace(emailAddress, currentUser, workspace);
            if (!isSend) throw translate("Invitation failed", "US");
            const invite = await this.dbRepository.createInvite({
                from: user._id,
                to: emailAddress,
                inviteType: "WORKSPACE",
                workspace: workspace._id
            }, session);

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

    async acceptWorkspaceInvite(requestBody, currentUser) {
        const { workspaceId } = requestBody;
        const session = await db.startSession();

        try {
            session.startTransaction(this.transactionOptions);

            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId });
            const invite = await this.dbRepository.getInvite({ to: currentUser.email, workspace: workspace._id }, { workspace: 1 });
            if (!invite) throw translate("You are not invited to this workspace.", this.defaultLanguage);
            await this.dbRepository.updateWorkspace({ _id: invite.workspace }, { $push: { users: user._id } }, session);
            await this.dbRepository.deleteInvite({ workspace: workspace._id, to: user.email }, session);
            await session.commitTransaction();

            return workspace;
        } catch (error) {
            logger.error(`Error# ${new Date()}: acceptWorkspaceInvite() \n ${error}`);
            await session.abortTransaction();
            throw new ApolloError(error);
        } finally {
            await session.endSession();
        }
    }

    async userWorkspaces(requestBody, currentUser) {
        const { filter } = requestBody;
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            filter.currentUser = user;
            if (!filter.skip) filter.skip = 0;
            return await this.dbRepository.getWorkspaces({
                $or: [{ owner: user._id }, { users: user._id }]
            }, {}, filter);
        } catch (error) {
            logger.error(`Error# ${new Date()}: userWorkspaces() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async #sendWorkspaceInvitationsWithEmail(workspace, emails, currentUser) {
        try {
            for (const email of emails) {
                const isSend = await this.mailRepository.inviteUserToWorkspace(email, currentUser, workspace);
                if (isSend) {
                    await this.dbRepository.createInvite({
                        from: currentUser._id,
                        to: email,
                        inviteType: "WORKSPACE",
                        workspace: workspace._id
                    });
                }
            }
        } catch (error) {
            logger.error(`Error# ${new Date()}: sendInvitationsWithEmail Failed \n ${error}`);
        }
    }
}
module.exports = WorkSpaceRepository;