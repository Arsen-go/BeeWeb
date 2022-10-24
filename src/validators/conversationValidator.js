const { ApolloError } = require("apollo-server-express");
const Validator = require("./validator");
const yup = require('yup');
const { translate } = require("../locales");

class WorkspaceValidator extends Validator {
    constructor(dbRepository) {
        super();
        this.dbRepository = dbRepository;
    }

    async validateCreateConversation(requestBody) {
        const { conversation } = requestBody;
        try {
            const schema = yup.object().shape({
                name: yup.string().min(1).max(20),
                userIds: yup.array().test("testUsersArray", translate("Invalid users", "US"), function (userIds) {
                    let invalids = [];
                    for (const i in userIds) {
                        if (!userIds[i] || !userIds[i].length) {
                            invalids.push(i);
                        }
                    }
                    if (invalids.length) return this.createError({
                        message: `Invalid id indexes ${invalids}`
                    });
                    return true;
                }),
                workspaceId: yup.string().required().test("testUsersArray", translate("Invalid workspace id", "US"), function (id) {
                    if (id.substring(0, 3) !== "ws_" || id.length < 10) {
                        return false;
                    }
                    return true;
                }),
            });
            await this.validateYupSchema(schema, conversation);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateAcceptConversationInvite(requestBody) {
        try {
            const schema = yup.object().shape({
                conversationId: yup.string().test("testCid", translate("Invalid conversation id", "US"), function (id) {
                    if (id.substring(0, 3) !== "cv_" || id.length < 10) {
                        return false;
                    }
                    return true;
                }),
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateFilter(requestBody) {
        const { filter } = requestBody;
        try {
            const schema = yup.object().shape({
                limit: yup.number().min(1).max(20),
                skip: yup.number().min(0)
            });
            await this.validateYupSchema(schema, filter);
        } catch (error) {
            throw new ApolloError(error);
        }
    }

    async validateInviteUserToConversation(requestBody) {
        try {
            const schema = yup.object().shape({
                conversationId: yup.string().test("testCid", translate("Invalid conversation id", "US"), function (id) {
                    if (id.substring(0, 3) !== "cv_" || id.length < 10) {
                        return false;
                    }
                    return true;
                }),
                userId: yup.string().required()
            });
            await this.validateYupSchema(schema, requestBody);
        } catch (error) {
            throw new ApolloError(error);
        }
    }
}

module.exports = WorkspaceValidator;