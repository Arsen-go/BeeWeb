const { User, EmailToken, Workspace, Invite, Conversation, Attachment } = require("../models");
const { passwordGenerator } = require("../database/mongodb");
const uniqid = require("uniqid");

class DbRepository {
    // #Email Token# //
    async createEmailToken(token, session) {
        const emailToken = new EmailToken(token);
        const saved = await emailToken.save({ session });
        return saved;
    }

    async getEmailToken(findBy) {
        return await EmailToken.findOne(findBy);
    }

    async deleteEmailToken(findBy) {
        return await EmailToken.deleteOne(findBy);
    }

    // #User# //
    async createUser(user, session) {
        const { hashedPassword, salt } = passwordGenerator.hash(user.password, passwordGenerator.generateSalt(12));
        user.password = hashedPassword;
        user.salt = salt;
        user.id = `us_${uniqid()}`;
        const newUser = new User(user);
        const savedUser = await newUser.save({ session });
        return savedUser;
    }

    async getUser(findBy, selectedFields) {
        return await User.findOne(findBy, selectedFields);
    }

    async comparePassword(password, salt, inputPassword) {
        if (!passwordGenerator.compare(password, salt, inputPassword)) return false;
        return true;
    }

    async getUsers(findBy, selectedFields, options) {
        return await User.find(findBy, selectedFields).limit(options.limit).skip(options.skip);
    }

    //  #Workspace# //
    async createWorkspace(workspace, session) {
        workspace.id = `ws_${uniqid()}`;
        const newWorkspace = new Workspace(workspace);
        const savedWorkspace = await newWorkspace.save({ session });
        return savedWorkspace;
    }

    async updateWorkspace(findBy, updatedFields) {
        return await Workspace.updateOne(findBy, updatedFields);
    }

    async getWorkspace(findBy, selectedFields) {
        return await Workspace.findOne(findBy, selectedFields);
    }

    async getWorkspaces(findBy, selectedFields, options) {
        switch (options.sortBy) {
            case "UPDATED_DATE":
                return await Workspace.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ updatedAt: options.orderBy });
            case "CREATED_DATE":
                return await Workspace.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ createdAt: options.orderBy });
            default:
                return await Workspace.find(findBy, selectedFields).skip(options.skip).limit(options.limit);
        }
    }

    //  #Invite# //
    async createInvite(invite, session) {
        invite.id = `inv_${uniqid()}`;
        const newInvite = new Invite(invite);
        const savedInvite = await newInvite.save({ session });
        return savedInvite;
    }

    async getInvite(findBy, selectedFields) {
        return await Invite.findOne(findBy, selectedFields);
    }

    async deleteInvite(findBy) {
        await Invite.deleteOne(findBy);
    }

    // #Conversation# //
    async createConversation(conversation, session) {
        conversation.id = `cv_${uniqid()}`;
        const newConversation = new Conversation(conversation);
        const savedConversation = await newConversation.save({ session });
        return savedConversation;
    }

    async updateConversation(findBy, updatedFields) {
        return await Conversation.updateOne(findBy, updatedFields);
    }

    async getConversation(findBy, selectedFields) {
        return await Conversation.findOne(findBy, selectedFields);
    }

    async getConversations(findBy, selectedFields, options) {
        switch (options.sortBy) {
            case "UPDATED_DATE":
                return await Conversation.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ updatedAt: options.orderBy });
            case "CREATED_DATE":
                return await Conversation.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ createdAt: options.orderBy });
            default:
                return await Conversation.find(findBy, selectedFields).skip(options.skip).limit(options.limit);
        }
    }

    async deleteConversation(findBy) {
        await Conversation.deleteOne(findBy);
    }

    // #Attachment# //
    async createAttachment(attachment, session) {
        attachment.id = `attach_${uniqid()}`;
        const newAttachment = new Attachment(attachment);
        const savedAttachment = await newAttachment.save({ session });
        return savedAttachment;
    }

    async deleteAttachment(findBy) {
        await Attachment.deleteOne(findBy);
    }

    async getAttachments(findBy, selectedFields, options) {
        switch (options.sortBy) {
            case "UPDATED_DATE":
                return await Attachment.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ updatedAt: options.orderBy });
            case "CREATED_DATE":
                return await Attachment.find(findBy, selectedFields).skip(options.skip).limit(options.limit).sort({ createdAt: options.orderBy });
            default:
                return await Attachment.find(findBy, selectedFields).skip(options.skip).limit(options.limit);
        }
    }
}

module.exports = DbRepository;