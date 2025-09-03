import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";
const { CLOUD_NAME, API_KEY, API_SECRET, FOLDER_NAME } = config.CLOUDINARY;
import { UploadedFile } from "express-fileupload";
import geminiHelper from "../helper/gemini.helper";
import FileModel from "../models/file.model";
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadFileOnCloudinary = async (file: UploadedFile) => {
  try {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: FOLDER_NAME }, (error, result) => {
          if (error) reject(error);
          // @ts-ignore
          resolve(result);
        })
        .end(file.data);
    });
    return {
      uploadId: result.public_id,
      url: result.url,
      type: file.mimetype,
      name: file.name,
    };
  } catch (error) {
    console.log("error::", error);
    throw error;
  }
};

const uploadFile = async (file: UploadedFile, userId: string) => {
  try {
    const cloudinaryResponse = await uploadFileOnCloudinary(file);
    const { type, url, uploadId } = cloudinaryResponse;
    const geminiFileResponse = await geminiHelper.uploadFile(url, type);
    await FileModel.create({
      createdBy: userId,
      path: url,
      uploadId: uploadId,
      size: file.size,
      name: file.name,
      type: file.mimetype,
    });
    return {
      fileId: geminiFileResponse.fileName,
      path: geminiFileResponse.uri,
    };
  } catch (error) {
    throw error;
  }
};

export default {uploadFile};
