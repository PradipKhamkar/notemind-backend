import { Schema, model } from "mongoose";
import { INote } from "../types/note.type";


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
    data: {
      type: Schema.Types.Mixed,
      required: true
    },
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
    transcript: { type: Schema.Types.Mixed },
    metaData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const NoteModel = model<INote>("Note", NoteSchema);
