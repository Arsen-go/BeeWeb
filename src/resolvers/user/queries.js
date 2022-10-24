const { authentication } = require("../../authentication");

let userRepository, dbRepository, userValidator;
class Queries {
    constructor(validators, repositories) {
        userValidator = validators.userValidator;
        userRepository = repositories.userRepository;
        dbRepository = repositories.dbRepository;
    }

    Query = {
        me: authentication.roleAuthentication(["USER"], // and any other roles that app can contain
            async (_, { }, { currentUser }) => {
                return await userRepository.me(currentUser);
            }),
    };

    Attachment = {
        owner: async (attachment) => await dbRepository.getUser({ _id: attachment.owner }),
    };
}

module.exports = { Queries };