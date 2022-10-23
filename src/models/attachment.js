const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  contentType: {
    type: String,
  },
  attachmentType: {
    type: String,
    enum: ["PROFILE", "WORKSPACE", "CONVERSATION", "LOGO"]
    // and any other type that application can have
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Attachment = mongoose.model("Attachment", AttachmentSchema);
module.exports = { Attachment };
