/* eslint-disable no-undef */
require('dotenv').config();
const { ApolloError } = require('apollo-server-express');
const jsonwebtoken = require("jsonwebtoken");
const { logger } = require('../logger');

class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.tokenExpiresIn = process.env.TOKEN_EXPIRES_AFTER;
    }

    async checkToken(authToken) {
        if (!authToken) throw new ApolloError("Unable to authenticate");

        try {
            const token = authToken.replace("Bearer ", "");
            const decoded = jsonwebtoken.verify(token, this.secret);
            if (!token) return null;
            return { currentUser: decoded };
        } catch (error) {
            logger.error(`Error# ${new Date}: checkToken() \n ${error}`);
        }
    }

    async createToken(data) {
        try {
            const expiresIn = this.tokenExpiresIn ? this.tokenExpiresIn : "1y";
            const authToken = jsonwebtoken.sign(
                data,
                this.secret,
                { expiresIn }
            );

            return { authToken, expiresIn };
        } catch (error) {
            logger.error(`Error# ${new Date}: createToken() \n ${error}`);
            throw new ApolloError(error, 500);
        }
    }
}

module.exports = new AuthService();