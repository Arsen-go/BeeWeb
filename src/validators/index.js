const UserValidator = require("./userValidator");
const WorkspaceValidator = require("./workspaceValidator");
const { dbRepository } = require("../repositories");

module.exports = {
    userValidator: new UserValidator(dbRepository),
    workspaceValidator: new WorkspaceValidator(dbRepository),
};