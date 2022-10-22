const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["USER"]
  },
  hash: String,
  salt: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = { User };
