const { PubSub } = require('graphql-subscriptions');
const UserRepository = require("./userRepository");
const MailRepository = require("./mailRepository");
const WorkspaceRepository = require("./workspaceRepository");
const ConversationRepository = require("./conversationRepository");
const AttachmentRepository = require("./attachmentRepository");
const DbRepository = require("./dbFactory.js");

const dbRepository = new DbRepository();
const mailRepository = new MailRepository(dbRepository);
const pubsub = new PubSub();

const repositories = {
    userRepository: new UserRepository(dbRepository, mailRepository),
    workspaceRepository: new WorkspaceRepository(dbRepository, mailRepository, pubsub),
    conversationRepository: new ConversationRepository(dbRepository, mailRepository, pubsub),
    attachmentRepository: new AttachmentRepository(dbRepository)
};

module.exports = {
    ...repositories,
    dbRepository, pubsub
};