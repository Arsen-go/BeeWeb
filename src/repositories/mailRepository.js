/* eslint-disable no-undef */
const { logger } = require("../logger");
const nodemailer = require('nodemailer');
const { ApolloError } = require("apollo-server-express");
const { translate } = require("../locales");

class MailRepository {
    constructor(dbRepository) {
        this.defaultLanguage = process.env.DEFAULT_LANGUAGE;
        this.transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.MAIL_ADDRESS,
                clientId: process.env.MAILER_CLIENT_ID,
                clientSecret: process.env.MAILER_CLIENT_SECRET,
                refreshToken: process.env.MAILER_REFRESH_TOKEN,
                accessToken: process.env.MAILER_ACCESS_TOKEN,
            }
        });

        this.transactionOptions = {
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary'
        };
        this.dbRepository = dbRepository;
    }

    async sendVerificationCode(email) {
        const code = Math.ceil(Math.random() * 10000000 % 1000000);
        const mailOptions = {
            from: "BeeWeb",
            to: email,
            subject: "",
            text: `Your code: ${code}`,
        };
        await this.dbRepository.createEmailToken({ code, email });
        await this.#sendEmail(mailOptions);
    }

    async inviteUserToWorkspace(email, currentUser, workspace) {
        // After this invitation client developer can get workspace id and send it to server for connecting workspace
        const mailOptions = {
            from: "BeeWeb",
            to: email,
            subject: "Invitation",
            text: `Your are invited to https://beewebsystems.com/?wid=${workspace.id}  from ${currentUser.email}`, //the workspaceId can ba changed with slag too
        };
        const isSend = await this.#sendEmail(mailOptions);
        if (!isSend) return;
        await this.dbRepository.createInvite({
            from: currentUser._id,
            to: email,
            inviteType: "WORKSPACE",
            workspace: workspace._id
        });
        // also we can inform user with subscription or notification
    }

    async inviteUserToConversation(userId, currentUser, conversation) {
        const user = await this.dbRepository.getUser({ id: userId });
        if (!user) return;
        const mailOptions = {
            from: "BeeWeb",
            to: user.email,
            subject: "Invitation",
            text: `Your are invited to https://beewebsystems.com/?cid=${conversation.id}  from ${currentUser.email}`,
        };
        const isSend = await this.#sendEmail(mailOptions);
        if (!isSend) return;
        const isInvited = await this.dbRepository.getInvite({ to: user.email });
        if (isInvited) return;
        await this.dbRepository.createInvite({
            from: currentUser._id,
            to: user.email,
            inviteType: "CONVERSATION",
            conversation: conversation._id
        });
        // also we can inform user with subscription or notification
    }

    async checkEmailToken(email, code) {
        const emailToken = await this.dbRepository.getEmailToken({ email, code });
        if (!emailToken) throw new ApolloError(translate("Verification code or email are wrong.", `${this.defaultLanguage}`));
        await this.dbRepository.deleteEmailToken({ _id: emailToken._id });
        return true;
    }

    async #sendEmail(mailOptions) {
        const mail = this.transport.sendMail(mailOptions);
        return await mail.then(() => {
            logger.info(`Mail successfully sent: ${mailOptions}`);
            return true;
        }).catch((error) => {
            logger.warn(`Sending mail failed: ${error}`);
            return false;
        });
    }
}

module.exports = MailRepository;