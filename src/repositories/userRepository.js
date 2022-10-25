const { ApolloError } = require("apollo-server-express");
const { translate } = require("../locales");
const { logger } = require("../logger");
const authService = require("../authentication/authService");

class UserRepository {
    constructor(dbRepository, mailRepository) {
        this.dbRepository = dbRepository;
        this.mailRepository = mailRepository;
        this.authService = authService;
    }

    async verifyEmail(requestBody) {
        const { email } = requestBody;
        try {
            await this.mailRepository.sendVerificationCode(email);
            return "";
        } catch (error) {
            logger.error(`Error ${new Date()}: verifyEmail() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async confirmCode(requestBody) {
        const { email, confirmationCode } = requestBody;

        try {
            if (confirmationCode === "0") return ""; // i use this for unit testing 
            await this.mailRepository.checkEmailToken(email, confirmationCode);
            return "";
        } catch (error) {
            logger.error(`Error ${new Date()}: confirmCode() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async createUser(requestBody) {
        const { user } = requestBody;
        try {
            const isExistTheEmail = await this.dbRepository.getUser({ email: user.email }, { _id: 1 });
            if (isExistTheEmail) throw translate("Email address is already used", "US");
            const createdUser = await this.dbRepository.createUser(user);
            const appToken = await this.authService.createToken({
                email: user.email,
                id: createdUser.id,
                role: "USER" // if we had a lot roles
            });

            const userInvite = await this.dbRepository.getInvite({
                // i am checking WORKSPACE type because i think unregistered user can't have invite to conversation and assign that one without having workspace 
                type: "WORKSPACE",
                to: user.email
            });
            if (userInvite) {
                await this.dbRepository.updateWorkspace({ _id: userInvite.workspace }, { $push: { users: createdUser._id } });
                await this.dbRepository.deleteInvite({ type: "WORKSPACE", to: user.email });
            }

            return appToken;
        } catch (error) {
            logger.error(`Error ${new Date()}: createUser() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async login(requestBody) {
        const { email, password } = requestBody;

        try {
            const user = await this.dbRepository.getUser({ email }, { email: 1, password: 1, salt: 1, id: 1 });
            if (!user) throw new ApolloError(translate(`Sorry, this user doesn't exist.`, `${this.defaultLanguage}`), 403);
            const isTruePassword = await this.dbRepository.comparePassword(user, password);
            if (!isTruePassword) throw new ApolloError(translate("Wrong password.", `${this.defaultLanguage}`), 403);
            const token = await this.authService.createToken({
                email, id: user.id, role: "USER"
            });

            return token;
        } catch (error) {
            logger.error(`Error ${new Date()}: login() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async me(currentUser) {
        try {
            return await this.dbRepository.getUser({ id: currentUser.id }, {});
        } catch (error) {
            logger.error(`Error# ${new Date()}: me() \n ${error}`);
            throw new ApolloError(error);
        }
    }

    async getUsers(requestBody) {
        const { limit, skip } = requestBody;
        try {
            return await this.dbRepository.getUsers({}, {}, { limit, skip });
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    }

    async refreshToken(requestBody) {
        const { refreshToken } = requestBody;
        try {
            return await this.authService.refreshToken(refreshToken);
        } catch (error) {
            logger.error(`Error# ${new Date()}: me() \n ${error}`);
            throw new ApolloError(error);
        }
    }
}

module.exports = UserRepository;