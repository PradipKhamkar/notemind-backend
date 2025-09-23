"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const config_1 = __importDefault(require("../config"));
const geminiClient = new genai_1.GoogleGenAI({ apiKey: config_1.default.GOOGLE.GEMINI_API_KEY });
const getNotesResponse = (system, messages, structureOutput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield geminiClient.models.generateContent({
            model: "gemini-1.5-flash",
            config: {
                systemInstruction: {
                    "parts": [
                        {
                            "text": system
                        }
                    ]
                },
                responseJsonSchema: structureOutput,
                responseMimeType: "application/json"
            },
            contents: messages
        });
        return res.text;
    }
    catch (error) {
        throw error;
    }
});
const getFileURLMessage = (fileUrl) => {
    return {
        fileData: {
            fileUri: fileUrl,
        },
    };
};
const uploadFile = (fileURL, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfBuffer = yield fetch(fileURL).then((response) => response.arrayBuffer());
        const fileBlob = new Blob([pdfBuffer], { type });
        const res = yield geminiClient.files.upload({ file: fileBlob, config: { mimeType: type } });
        console.log('Gemini File Upload Response::', res);
        return {
            fileName: res.name,
            size: res.sizeBytes,
            mimType: res.mimeType,
            uri: res.uri
        };
    }
    catch (error) {
        throw error;
    }
});
const deleteFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteRes = yield geminiClient.files.delete({ name: fileName });
        const allFiles = yield geminiClient.files.list();
        console.log('DELETE response', deleteRes);
        console.log('allFiles', allFiles);
        return deleteFile;
    }
    catch (error) {
        throw error;
    }
});
exports.default = { getNotesResponse, getFileURLMessage, geminiClient, uploadFile, deleteFile };
