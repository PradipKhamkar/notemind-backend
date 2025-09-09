import mongoose, { model, Schema } from "mongoose";
import { INote } from "../types/note.type";

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    source: {
      type: { type: String, enum: ["youtube", "web", "pdf", "audio", "video"], required: true },
      link: String,
      text: String,
    },
    content: {
      summary: {
        type: String,
        required: true,
      },
      keyTopics: {
        type: Array,
        required: true
      },
      required: true,
      actionPoints: {
        type: Array,
        required: true
      }
    },
    folder: {
      type: mongoose.Types.ObjectId,
      ref: "folder"
    },
    // @ts-ignore
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true
    },
    language: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      required: true,
      trim: true
    },
    metaData: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export const NoteModel = model<INote>("Note", NoteSchema);