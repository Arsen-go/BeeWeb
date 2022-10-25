const { authentication } = require("../../authentication");

let userRepository, dbRepository;
class Queries {
    constructor(validators, repositories) {
        userRepository = repositories.userRepository;
        dbRepository = repositories.dbRepository;
    }

    Query = {
        me: authentication.roleAuthentication(["USER"], // and any other roles that app can contain
            // eslint-disable-next-line no-empty-pattern
            async (_, { }, { currentUser }) => {
                return await userRepository.me(currentUser);
            }),
    };

    Attachment = {
        owner: async (attachment) => await dbRepository.getUser({ _id: attachment.owner }),
    };
}

module.exports = { Queries };