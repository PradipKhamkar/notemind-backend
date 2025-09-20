"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = void 0;
const mongoose_1 = require("mongoose");
const NoteSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    folder: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Folder",
    },
    // @ts-ignore
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transcript: { type: mongoose_1.Schema.Types.Mixed },
    metaData: { type: mongoose_1.Schema.Types.Mixed, default: {} },
}, { timestamps: true });
exports.NoteModel = (0, mongoose_1.model)("Note", NoteSchema);
