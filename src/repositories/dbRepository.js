const { User, EmailToken, Workspace } = require("../models");
const { passwordGenerator, db } = require("../database/mongodb")
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
}

module.exports = DbRepository;