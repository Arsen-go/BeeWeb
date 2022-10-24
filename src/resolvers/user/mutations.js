let userValidator, userRepository;
class Mutations {
    constructor(validators, repositories) {
        userValidator = validators.userValidator;
        userRepository = repositories.userRepository;
    }

    Mutation = {
        verifyEmail:
            async (_, requestBody) => {
                await userValidator.validateVerifyEmail(requestBody);
                return await userRepository.verifyEmail(requestBody);
            },

        confirmCode: async (_, requestBody) => {
            await userValidator.validateConfirmCode(requestBody);
            return await userRepository.confirmCode(requestBody);
        },

        createUser:
            async (_, requestBody) => {
                await userValidator.validateCreateUser(requestBody);
                return await userRepository.createUser(requestBody);
            },

        login:
            async (_, requestBody) => {
                await userValidator.validateLogin(requestBody);
                return await userRepository.login(requestBody);
            },

        refreshToken:
            async (_, requestBody) => {
                await userValidator.validateRefreshToken(requestBody);
                return await userRepository.refreshToken(requestBody);
            },
    };
}

module.exports = { Mutations };