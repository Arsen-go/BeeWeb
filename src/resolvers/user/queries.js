const { authentication } = require("../../authentication");

let userRepository, userValidator;
class Queries {
    constructor(validators, repositories) {
        userValidator = validators.userValidator;
        userRepository = repositories.userRepository;
    }

    Query = {
        me: authentication.roleAuthentication(["USER"], // and any other roles that app can contain
            async (_, {}, { currentUser }) => {
                return await userRepository.me(currentUser);
            }),
    };
}

module.exports = { Queries };