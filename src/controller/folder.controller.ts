import { Request, Response } from "express"
import { errorResponse, successResponse } from "../helper/response.helper"
import folderService from "../services/folder.service"

const create = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const results = await folderService.create(req.userId, req.body.name, req.body?.icon);
    successResponse(res, "folder created successfully", results, 201)
  } catch (error: any) {
    errorResponse(res, error?.message || 'failed to create folder!',)
  }
}



const remove = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const results = await folderService.remove(req.params.id,req.userId);
    successResponse(res, "folder deleted successfully", results, 200)
  } catch (error: any) {
    errorResponse(res, error?.message || 'failed to deleted folder!',)
  }
}



const update = async (request: Request, res: Response) => {
  try {
     console.log('update folder payload::',request.body)
    // @ts-ignore
    const userId = request.userId
    const folder = await folderService.update(request.body.folderId, request.body.data, userId);
    successResponse(res, "Folder Updated Successfully!", folder, 200);
  } catch (error: any) {
    console.log('Error In Update Folder', error)
    errorResponse(res, error?.message || "Failed To Folder")
  }
}




export default {create,remove,update}