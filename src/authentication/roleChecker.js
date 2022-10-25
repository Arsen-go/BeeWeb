const { logger } = require("../logger");
const { dbRepository } = require("../repositories");

class Authentication {
  roleAuthentication = (roles, next) => async (root, args, context, info) => {
    const { currentUser } = context;
    if (!currentUser) {
      throw new Error("Unauthenticated!", 401);
    }
    logger.info(`API CALL# ${currentUser.role} #${new Date()}# ${info.fieldName}`);

    if (!roles) {
      return next(root, args, context, info);
    }

    let role;
    if (currentUser) {
      const user = await dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
      if (!user) {
        logger.info(`#${new Date()}# ${currentUser} is not exist in db.`);
        throw new Error(`Token user is not exist.`, 500);
      }
      role = currentUser.role;
    }

    if (roles.includes(role)) {
      return next(root, args, context, info);
    } else {
      logger.info(`API CALL #${new Date()}# ${info.fieldName} is not accessible for this user`);
      throw new Error(`${info.fieldName} is not accessible for this user.`);
    }
  };
}

module.exports = new Authentication();