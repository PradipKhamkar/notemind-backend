import mongoose, { model, Schema } from "mongoose";
import { IFolder } from "../types/folder.type";

const folderSchema = new Schema<IFolder>({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3
  },
  icon: {
    type: String,
    required: false,
  },
  // @ts-ignore
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users"
  },
  isPin: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const FolderModel = model<IFolder>("folders", folderSchema);
export default FolderModel