import { GoogleGenAI } from "@google/genai";
import config from "../config";
import { UploadedFile } from "express-fileupload";
import { IRetryConfig } from "../types/llm.type";

const geminiClient = new GoogleGenAI({ apiKey: config.GOOGLE.GEMINI_API_KEY });

const getNotesResponse = async (
  system: string,
  messages: any[],
  structureOutput: any,
  modelName: string = "gemini-2.5-flash-lite",
  retryConfig: IRetryConfig = {
    jsonRetries: 2,
    apiRetryDelays: [50_000, 60_000],
    fallbackModel: "gemini-2.5-flash",
  }
) => {
  let apiAttempt = 0;
  let jsonAttempt = 0;
  let currentModel = modelName;

  while (true) {
    try {
      const res = await geminiClient.models.generateContent({
        model: currentModel,
        config: {
          systemInstruction: { parts: [{ text: system }] },
          responseJsonSchema: structureOutput,
          responseMimeType: "application/json",
        },
        contents: messages,
      });
      return JSON.parse(res.text as string);
    } catch (error: any) {
      console.log('ERROR INSIDE GEMINI NOTE RESPONSE', JSON.stringify(error))
      if (error instanceof SyntaxError) {
        jsonAttempt++;
        if (jsonAttempt > retryConfig.jsonRetries) { throw new Error(`JSON parse failed after ${retryConfig.jsonRetries} retries`); }
        console.warn(`JSON parse failed (attempt ${jsonAttempt}). Retrying with same model...`);
        continue; // quick retry, no wait
      }
      if (error?.status === 503 || error?.statusCode === 503) {
        if (apiAttempt < retryConfig.apiRetryDelays.length) {
          const waitTime = retryConfig.apiRetryDelays[apiAttempt];
          console.warn(`503 error. Waiting ${waitTime / 1000}s before retry (attempt ${apiAttempt + 1})...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          apiAttempt++;
          continue;
        }
      }
      if (currentModel !== retryConfig.fallbackModel) {
        console.warn(`503 persists. Switching model from ${currentModel} to ${retryConfig.fallbackModel}`);
        currentModel = retryConfig.fallbackModel;
        apiAttempt = 0;
        continue;
      }
      throw error
    }
  }
};

const getFileURLMessage = (fileUrl: string) => {
  return {
    fileData: {
      fileUri: fileUrl,
    },
  };
};

const uploadFile = async (file: UploadedFile, type: string) => {
  try {
    // const pdfBuffer = await fetch(fileURL).then((response) => response.arrayBuffer());
    // @ts-ignore
    const fileBlob = new Blob([file.data], { type });
    const res = await geminiClient.files.upload({
      file: fileBlob,
      config: { mimeType: type },
    });

    // POLLING FILE STATUS
    const fileId = res.name;
    const timeout = 10 * 60 * 1000; // 10 minutes
    const interval = 10 * 1000; // 10 seconds
    const start = Date.now();
    let fileStatus = res;

    while (Date.now() - start < timeout) {
      fileStatus = await geminiClient.files.get({ name: fileId as string });
      if (fileStatus.state === "ACTIVE") {
        console.log("File is ACTIVE ✅", fileStatus);
        break;
      }
      console.log("File still processing... state:", fileStatus.state);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    return {
      fileName: res.name,
      size: res.sizeBytes,
      mimType: res.mimeType,
      uri: res.uri,
    };
  } catch (error) {
    throw error;
  }
};

const deleteFile = async (fileName: string) => {
  try {
    const deleteRes = await geminiClient.files.delete({ name: fileName });
    const allFiles = await geminiClient.files.list();
    console.log("DELETE response", deleteRes);
    console.log("allFiles", allFiles);
    return deleteFile;
  } catch (error) {
    console.log("Error In Delete File::", error);
    throw error;
  }
};

export default {
  getNotesResponse,
  getFileURLMessage,
  geminiClient,
  uploadFile,
  deleteFile,
};
