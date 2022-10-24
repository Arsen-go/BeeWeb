const { translate } = require("../locales");
const { logger } = require("../logger");
const DbRepository = require("./dbRepository");
const dbRepository = new DbRepository();

class AttachmentRepository {
    constructor() {
        // eslint-disable-next-line no-undef
        this.defaultLanguage = process.env.DEFAULT_LANGUAGE;
    }

    async uploadWorkspaceAttachment({ file, body, currentUser }, res) {
        const { workspaceId } = body;
        try {
            const user = await dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            const attachment = await dbRepository.createAttachment({
                contentType: file.mimetype,
                attachmentType: "WORKSPACE",
                owner: user._id,
                path: file.path
            });
            const workspace = await dbRepository.getWorkspace({
                $or: [{ owner: user._id }, { users: user._id }]
            });
            if (!workspace) res.status(404).send({ error: translate("You have't any access to this workspace.") });

            await dbRepository.updateWorkspace({ id: workspaceId }, { $push: { files: attachment._id } });

            return res.status(200).send({ data: attachment });
        } catch (error) {
            logger.error(`Error# ${new Date()}: uploadWorkspaceAttachment() \n ${error}`);
            res.status(500).send({ error: error.message });
        }
    }

    async uploadConversationAttachment({ file, body, currentUser }, res) {
        const { conversationId } = body;
        try {
            const user = await dbRepository.getUser({ id: currentUser.id }, { _id: 1 });
            const attachment = await dbRepository.createAttachment({
                contentType: file.mimetype,
                attachmentType: "CONVERSATION",
                owner: user._id,
                path: file.path
            });

            const conversation = await dbRepository.getConversation({
                $or: [{ owner: user._id }, { users: user._id }]
            });
            if (!conversation) return res.status(404).send({ error: translate("You have't any access to this conversation.") });

            await dbRepository.updateConversation({ id: conversationId }, { $push: { files: attachment._id } });

            return res.status(200).send({ data: attachment });
        } catch (error) {
            logger.error(`Error# ${new Date()}: uploadConversationAttachment() \n ${error}`);
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = AttachmentRepository;