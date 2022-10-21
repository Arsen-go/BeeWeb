/* eslint-disable no-empty-pattern */
const { authentication } = require("../../authentication");

let userRepository, userValidator;
class Queries {
    constructor(validators, repositories) {
        userValidator = validators.userValidator;
        userRepository = repositories.userRepository;
    }

    Query = {
        users: authentication.authenticated(
            async (_, requestBody) => {
                await userValidator.validateGetUsers(requestBody);
                return await userRepository.getUsers(requestBody);
            }),
    }
}

module.exports = { Queries };