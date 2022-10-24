/* eslint-disable no-undef */
require('dotenv').config();
const { ApolloError } = require('apollo-server-express');
const jsonwebtoken = require("jsonwebtoken");
const { logger } = require('../logger');

class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.tokenExpiresIn = process.env.TOKEN_EXPIRES_AFTER ? process.env.TOKEN_EXPIRES_AFTER : "1y";
        this.refreshTokenExpiresAfter = process.env.REFRESH_TOKEN_EXPIRES_AFTER ? process.env.REFRESH_TOKEN_EXPIRES_AFTER : "2y";
    }

    verifyToken(authToken) {
        try {
            if (!authToken) return;
            const { currentUser } = this.#checkToken(authToken);
            return currentUser;
        } catch (error) {
            logger.warn(`Unable to authenticate using auth token: ${authToken}`);
        }
    }

    async createToken(data) {
        try {
            const expiresIn = this.tokenExpiresIn;
            const refreshTokenExpiresAfter = this.refreshTokenExpiresAfter;
            const authToken = jsonwebtoken.sign(
                data,
                this.secret,
                { expiresIn }
            );
            const refreshToken = jsonwebtoken.sign(
                data,
                process.env.JWT_SECRET,
                { expiresIn: this.refreshTokenExpiresAfter });

            return { authToken, expiresIn, refreshToken, refreshTokenExpiresAfter };
        } catch (error) {
            logger.error(`Error# ${new Date}: createToken() \n ${error}`);
            throw new ApolloError(error, 500);
        }
    }

    async checkRestToken(req, res, next) {
        try {
            if (!req.headers.authentication) {
                res.status(401).send({ error: "Unauthorized " });
            }

            const token = req.headers.authentication.replace("Bearer ", "");
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

            req.currentUser = decoded;
            return next();
        } catch (error) {
            logger.error(`${new Date}# checkRestToken ERROR ${error}`);
        }
    }

    async refreshToken(refreshToken) {
        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_SECRET);

        const authToken = jsonwebtoken.sign({ ...decoded, metadata: "authtoken" }, process.env.JWT_SECRET);
        const updatedRefreshToken = jsonwebtoken.sign(
            {...decoded},
            process.env.JWT_SECRET,
        );
        return {
            authToken,
            tokenExpiresAfter: this.tokenExpiresIn,
            refreshToken: updatedRefreshToken,
            refreshTokenExpiresAfter: this.refreshTokenExpiresAfter
        };
    }

    #checkToken(authToken) {
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
}

module.exports = new AuthService();