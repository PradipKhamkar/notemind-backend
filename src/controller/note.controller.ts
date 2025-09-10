import { Request, Response } from "express";
import noteService from "../services/note.service";
import { errorResponse, successResponse } from "../helper/response.helper";

const getAllNotes = async (request: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = request.userId
    const notes = await noteService.getAllNotes(userId);
    successResponse(res, "Notes Fetched Successfully!", notes, 200)
  } catch (error: any) {
    console.log('Error In Fetched Notes', error)
    errorResponse(res, error?.message || "Failed To Fetched All Notes")
  }
}


const updateNote = async (request: Request, res: Response) => {
  try {
     console.log('update payload::',request.body)
    // @ts-ignore
    const userId = request.userId
    const notes = await noteService.updateNote(request.body.noteId, request.body.data, userId);
    successResponse(res, "Note Updated Successfully!", notes, 200);
  } catch (error: any) {
    console.log('Error In Update Note', error)
    errorResponse(res, error?.message || "Failed To Update Note")
  }
}

export default { getAllNotes,updateNote }