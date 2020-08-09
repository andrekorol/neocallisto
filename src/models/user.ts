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

interface IUser extends Document {
  email: string;
  name: string;
  username: string;
  salt: Buffer;
  hash: Buffer;
}

const User: Model<IUser> = model<IUser>("User", userSchema, "users");

module.exports = User;
