const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  files: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = { Conversation };
