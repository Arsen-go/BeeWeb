const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InviteSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: {
        type: String,
        require: true
    },
    inviteType: {
        type: String,
        enum: ["WORKSPACE", "CONVERSATION"]
    },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
}, { timestamps: true });

const Invite = mongoose.model("Invite", InviteSchema);
module.exports = { Invite };
