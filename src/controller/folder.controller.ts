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


export default {create}