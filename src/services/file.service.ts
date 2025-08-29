import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
const { CLOUD_NAME, API_KEY, API_SECRET } = config.CLOUDINARY;
import {UploadedFile} from "express-fileupload";

const uploadFile = async (file:UploadedFile,userId:string) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "notes-ai" });
    return { uploadId: result.public_id, url: result.url, size: result.metadata }
  } catch (error) {
    throw error
  }
}

export default {
  uploadFile
}