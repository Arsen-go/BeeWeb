const { ValidationError } = require('apollo-server');

class Validator {
    constructor() {
        // eslint-disable-next-line no-undef
        this.language = process.env.DEFAULT_LANGUAGE;
    }

    async validateYupSchema(schema, input) {
        try {
            await schema
                .strict()
                .validate(input);
        } catch (error) {
            throw new ValidationError(error.message);
        }
    }
}

module.exports = Validator;