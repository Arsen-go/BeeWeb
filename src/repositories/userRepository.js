const { ApolloError } = require("apollo-server-express");

class UserRepository {
    constructor(dbRepository) {
        this.dbRepository = dbRepository;
    }

    async createUser({ user }) {
        try {
            const createdUser = await this.dbRepository.createUser(user);
            return createdUser;
        } catch (error) {
            throw new ApolloError(error, 500);
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
}

module.exports = UserRepository;