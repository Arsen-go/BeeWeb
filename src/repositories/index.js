const UserRepository = require("./userRepository");
const DbRepository = require("./dbRepository");
const dbRepository = new DbRepository();

const repositories = {
    userRepository: new UserRepository(dbRepository),
}

module.exports = {
    ...repositories,
    dbRepository,
};