const { authentication } = require("../../authentication");

let workspaceRepository, dbRepository, workspaceValidator;
class Queries {
    constructor(validators, repositories) {
        workspaceValidator = validators.workspaceValidator;
        workspaceRepository = repositories.workspaceRepository;
        dbRepository = repositories.dbRepository;
    }

    Query = {
        userWorkspaces: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await workspaceValidator.validateFilter(requestBody);
                return await workspaceRepository.userWorkspaces(requestBody, currentUser);
            }),
    };

    Workspace = {
        users: async (workspace) => await dbRepository.getUsers({ _id: workspace.users }, {}, {}),

        files: async (workspace) => await dbRepository.getAttachments({ _id: workspace.files }, {}, {}),

        owner: async (workspace) => await dbRepository.getUser({ _id: workspace.owner }),

        invites: async (workspace) => await dbRepository.getInvites({ workspace: workspace._id }, {}, {}),
    };
}

module.exports = { Queries };