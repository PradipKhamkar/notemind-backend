import { Request, Response } from "express";
import noteService from "../services/note.service";
import { errorResponse, successResponse } from "../helper/response.helper";
import fileService from "../services/file.service";
import { UploadedFile } from "express-fileupload";

const uploadFile = async (request: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = request.userId;
    const file = request?.files?.file
    if (!file) throw new Error('File Not Found For Upload!');
    const newFile = await fileService.uploadFile(file as UploadedFile, userId)
    successResponse(res, "File Uploaded Successfully!", newFile, 200)
  } catch (error: any) {
    console.log('Error In Upload File', error)
    errorResponse(res, error?.message || "Failed To Upload Files")
  }
}
export default { uploadFile }