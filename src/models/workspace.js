const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slag: {
    type: String,
    required: true
  },
  files: [{ type: Schema.Types.ObjectId,  ref: 'Attachment' }],
  users: [{ type: Schema.Types.ObjectId,  ref: 'User' }],
  owner: { type: Schema.Types.ObjectId,  ref: 'User', required: true },
}, { timestamps: true });

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
module.exports = { Workspace };
