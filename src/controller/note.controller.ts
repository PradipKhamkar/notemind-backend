import { Request, Response } from "express";
import noteService from "../services/note.service";
import { errorResponse, successResponse } from "../helper/response.helper";

const getAllNotes = async(request:Request,res:Response)=>{
  try {
    // @ts-ignore
    const userId = request.userId
    const notes = await noteService.getAllNotes(userId);
  successResponse(res,"Notes Fetched Successfully!",{notes},200)
  } catch (error:any) {
    console.log('Error In Fetched Notes',error)
   errorResponse(res,error?.message||"Failed To Fetched All Notes")
  }
}
export default {getAllNotes}