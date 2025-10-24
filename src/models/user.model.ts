import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user.type";
import config from "../config";



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
    freeQuotaExceed:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", UserSchema);
