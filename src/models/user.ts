import { Document, model, Model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
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

interface User extends Document {
  email: string;
  name: string;
  username: string;
  salt: Buffer;
  hash: Buffer;
}

const UserModel: Model<User> = model<User>("User", userSchema, "users");

module.exports = UserModel;
