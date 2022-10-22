const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  fileId: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  key: {
    type: String,
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Attachment = mongoose.model("Attachment", AttachmentSchema);
module.exports = { Attachment };
