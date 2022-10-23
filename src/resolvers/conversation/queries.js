const { authentication } = require("../../authentication");

let workspaceRepository, workspaceValidator;
class Queries {
    constructor(validators, repositories) {
        workspaceValidator = validators.workspaceValidator;
        workspaceRepository = repositories.workspaceRepository;
    }

    Query = {
        userWorkspaces: authentication.roleAuthentication(["USER"],
            async (_, requestBody, { currentUser }) => {
                await workspaceValidator.validateWorkspaceFilter(requestBody)
                return await workspaceRepository.userWorkspaces(requestBody, currentUser);
            }),
    }
}

module.exports = { Queries };