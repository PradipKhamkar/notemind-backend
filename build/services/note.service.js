"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gemini_helper_1 = __importDefault(require("../helper/gemini.helper"));
const prompt_constant_1 = __importDefault(require("../constants/prompt.constant"));
const note_model_1 = require("../models/note.model");
const folder_model_1 = __importDefault(require("../models/folder.model"));
const structure_constant_1 = __importStar(require("../constants/structure.constant"));
const note_helper_1 = __importDefault(require("../helper/note.helper"));
const socket_constant_1 = __importDefault(require("../constants/socket.constant"));
const newNote = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield note_helper_1.default.checkUserQuota(userId);
        // === Input prep ===
        const { type, sourceData } = payload;
        const { link, fileId, originalPath, uploadId } = sourceData;
        const messages = [];
        if (link)
            messages.push(gemini_helper_1.default.getFileURLMessage(link));
        const system = prompt_constant_1.default.systemPrompt[type];
        // @ts-ignore
        const notesData = {};
        const aiStructureOutput = yield gemini_helper_1.default.getNotesResponse(system, messages, structure_constant_1.responseFormat);
        // === Map response into DB schema ===
        notesData["title"] = aiStructureOutput.title;
        notesData.data = [
            {
                language: 'default',
                content: {
                    keyPoints: aiStructureOutput.key_points,
                    sections: aiStructureOutput.sections,
                    summary: aiStructureOutput.summary,
                },
            },
        ];
        notesData.metaData = aiStructureOutput === null || aiStructureOutput === void 0 ? void 0 : aiStructureOutput.metaData;
        notesData.source = { type, link, uploadId };
        if (originalPath)
            notesData["source"]["link"] = originalPath;
        if (fileId)
            gemini_helper_1.default.deleteFile(fileId);
        // Save note
        const newNote = yield note_model_1.NoteModel.create(Object.assign(Object.assign({}, notesData), { createdBy: userId }));
        return newNote;
    }
    catch (error) {
        console.log("Error In Create Note", error);
        throw error;
    }
});
const getAllNotes = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield note_model_1.NoteModel.find({ createdBy: userId }).select('-createdBy');
        ;
        const folders = yield folder_model_1.default.find({ createdBy: userId }).select('-createdBy').sort({ order: 1 });
        return { notes, folders };
    }
    catch (error) {
        throw error;
    }
});
const updateNote = (noteId, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setOperations = {};
        const arrayFilters = [];
        // handle `data` updates (translations)
        if (payload.data && Array.isArray(payload.data)) {
            payload.data.forEach((entry, i) => {
                setOperations[`data.$[elem${i}].content`] = entry.content;
                arrayFilters.push({ [`elem${i}.language`]: entry.language });
            });
        }
        // handle other top-level fields dynamically
        Object.entries(payload).forEach(([key, value]) => {
            if (key !== "data" && key !== "_id") {
                setOperations[key] = value;
            }
        });
        const note = yield note_model_1.NoteModel.findOneAndUpdate({ createdBy: userId, _id: noteId }, { $set: setOperations }, {
            new: true,
            arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
        });
        if (!note)
            throw new Error("Note not found!");
        return note;
    }
    catch (error) {
        throw error;
    }
});
const deleteNote = (noteId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.NoteModel.findByIdAndDelete({ createdBy: userId, _id: noteId });
        if (!note)
            throw new Error("Note Not Found!");
        return;
    }
    catch (error) {
        throw error;
    }
});
const translateNote = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.NoteModel.findOne({ _id: payload.noteId, createdBy: userId });
        if (!note)
            throw new Error('note not found!');
        const { sourceLanguage, targetLanguage } = payload.data;
        const sourceNoteContent = note.data.find((d) => d.language === sourceLanguage);
        if (!sourceNoteContent)
            throw new Error('source content not found!');
        const messages = [{
                text: `
      noteData:${JSON.stringify(sourceNoteContent)}
      source_language:${sourceLanguage}
      target_language:${targetLanguage}`
            }];
        const res = yield gemini_helper_1.default.getNotesResponse(prompt_constant_1.default.translateNote, messages, structure_constant_1.default.translate);
        const { key_points, sections, summary } = res || {};
        const content = { content: { keyPoints: key_points, sections, summary }, language: targetLanguage, };
        note.data = [...note.data, content];
        yield note.save();
        return {
            updatedNote: note,
            content: content
        };
    }
    catch (error) {
        console.log('err', error);
        throw error;
    }
});
const askNote = (socket, userId, noteId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    const { askNote } = socket_constant_1.default.events;
    try {
        socket.emit(askNote.message, {
            type: "pull_db",
            content: { message: "Retrieving Note..." }
        });
        const noteInfo = yield note_model_1.NoteModel.findOne({ _id: noteId, createdBy: userId });
        if (!noteInfo)
            throw new Error("Note Not Found!");
        const noteContext = (_d = noteInfo.data.find((d) => d.language === "default")) === null || _d === void 0 ? void 0 : _d.content;
        socket.emit(askNote.message, {
            type: "thinking",
            content: { message: "Reading Note..." }
        });
        // start stream
        const systemInstruction = `You are an intelligent assistant that helps users work with their notes.
You are given the context of a note written by the user. Use this note context to understand their ideas, writing style, and intent.
When answering questions or generating content, reference the note’s information when relevant.
If the note does not contain the requested information, respond naturally and provide helpful, general insights.
Always keep responses concise, coherent, and contextually aligned with the user’s note.
Note Context:${JSON.stringify(noteContext)}`;
        const messages = [...noteInfo.messages || [], { role: "user", content: query }];
        const streamRes = yield gemini_helper_1.default.streamResponse(messages, systemInstruction);
        // streaming ai response;
        let finalText = "";
        try {
            for (var _e = true, streamRes_1 = __asyncValues(streamRes), streamRes_1_1; streamRes_1_1 = yield streamRes_1.next(), _a = streamRes_1_1.done, !_a; _e = true) {
                _c = streamRes_1_1.value;
                _e = false;
                let chunk = _c;
                const textRes = chunk.text;
                if (textRes) {
                    finalText += chunk.text;
                    socket.emit(askNote.message, {
                        type: "text",
                        content: { message: finalText }
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = streamRes_1.return)) yield _b.call(streamRes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        socket.emit(askNote.message, { content: { message: finalText }, type: "completed" });
        // store chat history
        messages.push({ role: "assistant", content: finalText });
        noteInfo.messages = messages;
        yield noteInfo.save();
        return {};
    }
    catch (error) {
        throw error;
    }
});
exports.default = { newNote, getAllNotes, updateNote, deleteNote, translateNote, askNote };
