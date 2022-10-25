const crypto = require('crypto');

class PasswordGenerator {
    generateSalt = rounds => {
        if (rounds >= 15) {
            throw new Error(`${rounds} is greater than 15,Must be less that 15`);
        }
        if (typeof rounds !== 'number') {
            throw new Error('rounds param must be a number');
        }
        if (rounds == null) {
            rounds = 12;
        }
        return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
    };

    hash = (password, salt) => {
        if (password == null || salt == null) {
            throw new Error('Must Provide Password and salt values');
        }
        if (typeof password !== 'string' || typeof salt !== 'string') {
            throw new Error('Password must be a string and salt must either be a salt string or a number of rounds');
        }
        return this.#createHash(password, salt);
    };

    compare = (hashedPassword, salt, password) => {
        if (password == null || salt == null) {
            throw new Error('Password and salt is required to compare');
        }
        if (typeof password !== 'string') {
            throw new Error('Password must be a String.');
        }
        const passwordData = this.#createHash(password, salt);
        if (passwordData.hashedPassword === hashedPassword) {
            return true;
        }
        return false;
    };

    #createHash = (password, salt) => {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            hashedPassword: value
        };
    };
}

module.exports = new PasswordGenerator();