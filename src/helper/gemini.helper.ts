import {
  GoogleGenAI,
} from "@google/genai";
import config from "../config";

const geminiClient = new GoogleGenAI({ apiKey: config.GOOGLE.GEMINI_API_KEY });

const getNotesResponse = async (system: string, messages: any[], structureOutput: any) => {
  try {
    const res = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
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
    return res.text
  } catch (error) {
    throw error
  }
}

const getFileURLMessage = (fileUrl: string) => {
  return {
    fileData: {
      fileUri: fileUrl,
    },
  }
}

const uploadFile = async (fileURL: string, type: string) => {
  try {
    const pdfBuffer = await fetch(fileURL).then((response) => response.arrayBuffer());
    const fileBlob = new Blob([pdfBuffer], { type });
    const res = await geminiClient.files.upload({ file: fileBlob, config: { mimeType: type } });
    return {
      fileName: res.name,
      size: res.sizeBytes,
      mimType: res.mimeType,
      uri: res.uri
    }
  } catch (error) {
    throw error
  }
}

const deleteFile = async (fileName: string) => {
  try {
    const deleteRes = await geminiClient.files.delete({ name: fileName });
    const allFiles = await geminiClient.files.list();
    console.log('DELETE response', deleteRes);
    console.log('allFiles', allFiles);
    return deleteFile
  } catch (error) {
    throw error
  }
}

export default { getNotesResponse, getFileURLMessage, geminiClient, uploadFile, deleteFile }
