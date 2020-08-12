"use strict";
exports.__esModule = true;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  hash: {
    type: Buffer,
    required: true,
  },
});
const User = mongoose_1.model("User", userSchema, "users");
module.exports = User;
