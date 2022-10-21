const { User } = require("../models");
const uniqid = require("uniqid");


class DbRepository {
    async createUser(user, session) {
        user.id = `us_${uniqid()}`;
        const newUser = new User(user);
        const savedUser = await newUser.save({ session });
        return savedUser;
    }

    async getUsers(findBy, selectedFields, { limit, skip }) {
        return await User.find(findBy, selectedFields).limit(limit).skip(skip);
    }
}

module.exports = DbRepository;