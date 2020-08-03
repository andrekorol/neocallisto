import { Document, model, Model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
