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
    }

    async createWorkspace(requestBody, currentUser) {
        const { workspace } = requestBody;
        const session = await db.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            session.startTransaction(transactionOptions);

            const { emails, name } = workspace;
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const createdWorkspace = await this.dbRepository.createWorkspace({
                owner: user._id,
                name,
                slag: name.replace(/\s/g, '').toLowerCase()
            });

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
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId });
            if (!workspace) throw translate("Workspace is not exist.", "US");
            const inviteTo = await this.dbRepository.getUser({ email: emailAddress });
            if (!inviteTo) {
                this.#sendWorkspaceInvitationsWithEmail(workspace, [emailAddress], user);
            }

            const invite = await this.dbRepository.createInvite({
                from: user._id,
                to: emailAddress,
                inviteType: "WORKSPACE",
                workspace: workspace._id
            });
            this.pubsub.publish("invitationListener", { invitationListener: invite, user: inviteTo });

            return "";
        } catch (error) {
            logger.error(`Error# ${new Date()}: inviteUserToWorkspace() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async acceptWorkspaceInvite(requestBody, currentUser) {
        const { workspaceId } = requestBody;

        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const workspace = await this.dbRepository.getWorkspace({ id: workspaceId });
            const invite = await this.dbRepository.getInvite({ to: currentUser.email, workspace: workspace._id }, { workspace: 1 });
            if (!invite) throw translate("You are not invited to this workspace.", this.defaultLanguage);
            await this.dbRepository.updateWorkspace({ _id: invite.workspace }, { $push: { users: user._id } });
            await this.dbRepository.deleteInvite({ workspace: workspace._id, to: user.email });
            return workspace;
        } catch (error) {
            logger.error(`Error# ${new Date()}: acceptWorkspaceInvite() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async userWorkspaces(requestBody, currentUser) {
        const { filter } = requestBody;
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            return await this.dbRepository.getWorkspaces({
                $or: [{ owner: user._id }, { users: user._id }]
            }, {}, filter);
        } catch (error) {
            logger.error(`Error# ${new Date()}: userWorkspaces() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    #sendWorkspaceInvitationsWithEmail(workspace, emails, currentUser) {
        try {
            for (const email of emails) {
                this.mailRepository.inviteUserToWorkspace(email, currentUser, workspace);
            }
        } catch (error) {
            logger.error(`Error# ${new Date()}: sendInvitationsWithEmail Failed \n ${error}`);
        }
    }
}
module.exports = WorkSpaceRepository;