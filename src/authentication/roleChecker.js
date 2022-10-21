const { logger } = require("../logger");

class Authentication {
  authenticated = (next) => (root, args, context, info) => {
    const { currentUser } = context;

    if (!currentUser) {
      throw new Error("Unauthenticated!", 401);
    }

    logger.info(`API CALL #${new Date()}# ${info.fieldName}`)
    return next(root, args, context, info);
  };
}

module.exports = new Authentication();