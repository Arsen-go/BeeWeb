/* eslint-disable no-undef */
require('dotenv').config();
const { ApolloError } = require('apollo-server-express');
const jsonwebtoken = require("jsonwebtoken");
const { logger } = require('../logger');

class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
    }

    async checkToken(authToken) {
        if (!authToken) throw new ApolloError("Unable to authenticate");

        try {
            const token = authToken.replace("auth ", "");
            // jsonwebtoken.verify(token, process.env.JWT_SECRET);
            if (!token) return null;
            return { currentUser: { info: "some info after decoding" } };
        } catch (error) {
            logger.error(`${new Date}# checkToken ERROR ${error}`);
            console.log(error);
        }
    }

    async createToken(data, expiresIn) {
        try {
            const authToken = jsonwebtoken.sign(
                data,
                this.secret,
                { expiresIn: expiresIn ? expiresIn : "1y" }
            );

            return { authToken: authToken, expiresIn: expiresIn ? expiresIn : "1y" };
        } catch (error) {
            logger.error(`${new Date}# createToken ERROR ${error}`);
            throw new ApolloError(error, 500);
        }
    }
}

module.exports = new AuthService();