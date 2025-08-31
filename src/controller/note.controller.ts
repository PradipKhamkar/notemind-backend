import { Request, Response } from "express";
import noteService from "../services/note.service";

const newNote = async(request:Request,res:Response)=>{
  try {
    const newNote = await noteService.newNote("",request.body);
    res.json({newNote:newNote}).status(201)
  } catch (error) {
    console.log('Error',error)
    res.json({
      error:error
    }).status(400)
  }
}

export default {newNote}