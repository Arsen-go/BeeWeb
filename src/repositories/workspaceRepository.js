const { ApolloError } = require("apollo-server-core");
const { translate } = require("../locales");
const { logger } = require("../logger");

class WorkSpaceResolver {
    constructor(dbRepository, mailRepository) {
        this.dbRepository = dbRepository;
        this.mailRepository = mailRepository;
        // eslint-disable-next-line no-undef
        this.defaultLanguage = process.env.DEFAULT_LANGUAGE;
    }

    async createWorkspace(requestBody, currentUser) {
        const { workspace } = requestBody;
        try {
            const { emails, name } = workspace;
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            const createdWorkspace = await this.dbRepository.createWorkspace({
                owner: user._id,
                name,
                slag: name.replace(/\s/g, '').toLowerCase()
            });

            // Invitations with nodeMailer also we can do that with twillo
            this.#sendWorkspaceInvitationsWithEmail(createdWorkspace, emails, user);

            return createdWorkspace;
        } catch (error) {
            logger.error(`Error# ${new Date()}: createWorkspace() \n ${error}`);
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
module.exports = WorkSpaceResolver;