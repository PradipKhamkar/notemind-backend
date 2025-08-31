import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user.type";


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    loginProvider: {
      type: String,
      required: true,
      enum: ["google", "github", "facebook", "apple", "email", "other"],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", UserSchema);
