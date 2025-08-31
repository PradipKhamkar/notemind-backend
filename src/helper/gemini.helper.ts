import {
  GoogleGenAI,
} from "@google/genai";
import config from "../config";

const client = new GoogleGenAI({ apiKey: config.GOOGLE.GEMINI_API_KEY });

const getNotesResponse = async (system: string, messages: any[], structureOutput: any) => {
  try {
    const res = await client.models.generateContent({
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

export default { getNotesResponse,getFileURLMessage }