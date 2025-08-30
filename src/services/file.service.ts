import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
const { CLOUD_NAME, API_KEY, API_SECRET, FOLDER_NAME } = config.CLOUDINARY;
import { UploadedFile } from "express-fileupload";

const uploadFile = async (file: UploadedFile, userId: string) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: FOLDER_NAME }, (error, result) => {
        if (error) reject(error);
        // @ts-ignore
        resolve(result)
      }).end(file.data);
    });
    return { uploadId: result.public_id, url: result.url }
  } catch (error) {
    console.log('error::', error)
    throw error
  }
}

export default {
  uploadFile
}