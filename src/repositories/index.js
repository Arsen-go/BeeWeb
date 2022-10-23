const UserRepository = require("./userRepository");
const MailRepository = require("./mailRepository");
const WorkspaceRepository = require("./workspaceRepository");
const ConversationRepository = require("./conversationRepository");
const AttachmentRepository = require("./attachmentRepository");
const DbRepository = require("./dbRepository");

const { authService } = require("../authentication");

const dbRepository = new DbRepository();
const mailRepository = new MailRepository(dbRepository);

const repositories = {
    userRepository: new UserRepository(dbRepository, mailRepository, authService),
    workspaceRepository: new WorkspaceRepository(dbRepository, mailRepository),
    conversationRepository: new ConversationRepository(dbRepository, mailRepository),
    attachmentRepository: new AttachmentRepository(dbRepository)
};

module.exports = {
    ...repositories,
    dbRepository,
};