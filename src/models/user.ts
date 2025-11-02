import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", userSchema);