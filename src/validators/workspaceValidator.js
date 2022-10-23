const { ApolloError } = require("apollo-server-express");
const Validator = require("./validator");
const yup = require('yup');
const { translate } = require("../locales");

class WorkspaceValidator extends Validator {
    constructor(dbRepository) {
        super();
        this.dbRepository = dbRepository;
    }

    async validateCreateWorkspace(requestBody) {
        const { workspace } = requestBody;
        try {
            const dbRepository = this.dbRepository;
            const schema = yup.object().shape({
                name: yup.string().required().min(1).max(100).test("testSlag", translate("Try another name", "US"), async function (name) {
                    const workspace = await dbRepository.getWorkspace({ slag: name.replace(/\s/g, '').toLowerCase() });
                    if (workspace) return false;
                    return true;
                }),
                emails: yup.array().test("testUsersArray", translate("Invalid users", "US"), function (emails) {
                    let invalids = [];
                    for (const i in emails) {
                        if (!emails[i] || !emails[i].length) {
                            invalids.push(i)
                        }
                    }
                    if (invalids.length) return this.createError({
                        message: `Invalid's indexes ${invalids}`
                    })
                    return true;
                })
            });
            await this.validateYupSchema(schema, workspace);
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async validateWorkspaceFilter(requestBody) {
        const { filter } = requestBody
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

    async validateAcceptWorkspaceInvite(requestBody) {
        try {
            const schema = yup.object().shape({
                workspaceId: yup.string().test("testWid", translate("Invalid workspace id", "US"), function (id) {
                    if (id.substring(0, 3) !== "ws_" || id.length < 10) {
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
};

module.exports = WorkspaceValidator;