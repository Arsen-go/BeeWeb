const { authentication } = require("../../authentication");

let workspaceValidator, workspaceRepository;
class Mutations {
    constructor(validators, repositories) {
        workspaceValidator = validators.workspaceValidator;
        workspaceRepository = repositories.workspaceRepository;
    }

    Mutation = {
        createWorkspace: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await workspaceValidator.validateCreateWorkspace(requestBody);
                return await workspaceRepository.createWorkspace(requestBody, currentUser);
            }),

        acceptWorkspaceInvite: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await workspaceValidator.validateAcceptWorkspaceInvite(requestBody);
                return await workspaceRepository.acceptWorkspaceInvite(requestBody, currentUser);
            }),
    }
}

module.exports = { Mutations };