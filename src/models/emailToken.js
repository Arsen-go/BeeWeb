const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
    code: {
        type: String,
    },
    email: {
        type: String,
    },
}, { timestamps: true });

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
module.exports = { EmailToken };
