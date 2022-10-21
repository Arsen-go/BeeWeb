let userValidator, userRepository;
class Mutations {
    constructor(validators, repositories) {
        userValidator = validators.userValidator;
        userRepository = repositories.userRepository;
    }

    Mutation = {
        createUser:
            async (_, requestBody) => {
                await userValidator.validateCreateUser(requestBody);
                return await userRepository.createUser(requestBody);
            },
    }
}

module.exports = { Mutations };