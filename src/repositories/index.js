const UserRepository = require("./userRepository");
const MailRepository = require("./mailRepository");
const WorkspaceRepository = require("./workspaceRepository");
const DbRepository = require("./dbRepository");

const { authService } = require("../authentication");

const dbRepository = new DbRepository();
const mailRepository = new MailRepository(dbRepository);

const repositories = {
    userRepository: new UserRepository(dbRepository, mailRepository, authService),
    workspaceRepository: new WorkspaceRepository(dbRepository, mailRepository),
}

module.exports = {
    ...repositories,
    dbRepository,
};