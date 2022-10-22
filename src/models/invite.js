const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    // type
}, { timestamps: true });

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
module.exports = { EmailToken };
