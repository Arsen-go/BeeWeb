class WorkSpaceResolver {
    constructor(dbRepository, mailRepository) {
        this.dbRepository = dbRepository;
        this.mailRepository = mailRepository;
    }

    async createWorkspace(requestBody, currentUser) {
        const { workspace } = requestBody;
        try {
            const { emails, name } = workspace;
            const user = await this.dbRepository.getUser({ id: currentUser.id });
            // Users that we will send an invitation
            const workspaceUsers = await this.dbRepository.getUsers({ $in: { email: emails } }, { _id: 1 }, {});

            // Invitations with nodeMailer also we can do that with twillo
            //this.#sendInvitationsWithEmail(workspaceUsers, user);   ??????????????? deep url

            const createdWorkspace = await this.dbRepository.createWorkspace({
                owner: user._id,
                name,
                slag: name.replace(/\s/g, '').toLowerCase()
            })

            return createdWorkspace;
        } catch (error) {
            logger.error(`Error# ${new Date()}: createWorkspace() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async userWorkspaces(requestBody, currentUser) {
        const { filter } = requestBody;
        try {
            const user = await this.dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            return await this.dbRepository.getWorkspaces({
                $or: [{ owner: user._id }, { users: user._id }]
            }, {}, filter)
        } catch (error) {
            logger.error(`Error# ${new Date()}: userWorkspaces() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    #sendInvitationsWithEmail(workspaceUsers, user) {
        try {
            for (const wUser of workspaceUsers) {
                this.mailRepository.inviteUser(wUser);
            }
        } catch (error) {
            logger.error(`Error# ${new Date()}: sendInvitationsWithEmail Failed \n ${error}`);
        }
    }
}
module.exports = WorkSpaceResolver;