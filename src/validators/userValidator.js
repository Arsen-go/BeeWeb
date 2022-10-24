const { ApolloError } = require("apollo-server-express");
const Validator = require("./validator");
const yup = require('yup');

class UserValidator extends Validator {
    constructor(dbRepository) {
        super();
        this.dbRepository = dbRepository;
    }

    async validateVerifyEmail(requestBody) {
        try {
            const schema = yup.object().shape({
                email: yup.string().required().email(),
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateConfirmCode(requestBody) {
        try {
            const schema = yup.object().shape({
                email: yup.string().required().email(),
                confirmationCode: yup.string().required(),
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateCreateUser(requestBody) {
        const { user } = requestBody;
        try {
            const schema = yup.object().shape({
                fullName: yup.string().required().min(4).max(100),
                email: yup.string().required().email(),
                password: yup.string().min(5).max(100).required() // or can be any format that needs
            });
            await this.validateYupSchema(schema, user);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateLogin(requestBody) {
        try {
            const schema = yup.object().shape({
                email: yup.string().required().email(),
                password: yup.string().min(5).max(100).required()
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateGetUsers({ limit, skip }) {
        try {
            const schema = yup.object().shape({
                limit: yup.number().required().min(1).max(100),
                skip: yup.number(),
            });
            await this.validateYupSchema(schema, { limit, skip });
        } catch (error) {
            throw new ApolloError(error, 406);
        }
    }

    async validateRefreshToken(requestBody) {
        try {
            const schema = yup.object().shape({
                refreshToken: yup.string().required(),
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error, 406);
        }
    }
}

module.exports = UserValidator;