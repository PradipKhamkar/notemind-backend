import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";
const { CLOUD_NAME, API_KEY, API_SECRET, FOLDER_NAME } = config.CLOUDINARY;
import { UploadedFile } from "express-fileupload";
import geminiHelper from "../helper/gemini.helper";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadFileOnCloudinary = async (file: UploadedFile) => {
  try {
    const resourceType = file.mimetype.includes("video") || file.mimetype.includes("audio") ? "video" : "auto"
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: FOLDER_NAME, resource_type: resourceType }, (error, result) => {
          if (error) reject(error);
          // @ts-ignore
          resolve(result);
        })
        .end(file.data);
    });
    return {
      uploadId: result.public_id,
      url: result.secure_url,
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
    // const cloudinaryResponse = await uploadFileOnCloudinary(file);
    // const { type, url, uploadId } = cloudinaryResponse;
    // console.log('file::',file.data)
    const geminiFileResponse = await geminiHelper.uploadFile(file, file.mimetype);
    // await FileModel.create({
    //   createdBy: userId,
    //   // path: url,
    //   // uploadId: uploadId,
    //   size: file.size,
    //   name: file.name,
    //   type: file.mimetype,
    // });
    return {
      tempFileId: geminiFileResponse.fileName,
      tempPath: geminiFileResponse.uri,
      // originalPath:cloudinaryResponse.url,
      // uploadId:cloudinaryResponse.uploadId
    };
  } catch (error) {
    console.log('Error In File Uploading::', JSON.stringify(error))
    throw error;
  }
};

export default { uploadFile };
