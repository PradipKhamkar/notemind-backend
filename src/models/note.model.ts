import  { Schema, model } from "mongoose";
import { INote } from "../types/note.type";

const SectionSchema = new Schema(
  {
    heading: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    source: {
      type: {
        type: String,
        enum: ["youtube", "web", "pdf", "audio", "video"],
        required: true,
      },
      link: { type: String },
      text: { type: String },
    },
    summary: { type: String, required: true },
    keyPoints: [{ type: String, required: true }],
    sections: { type: [SectionSchema], required: true },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    // @ts-ignore
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: { type: String, required: true },
    transcript: { type: String, required: true, trim: true },
    metaData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const NoteModel = model<INote>("Note", NoteSchema);
