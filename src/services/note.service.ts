import { INewNotePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import structureOutputJSONSchema from "../constants/structure.constant";
import { NoteModel } from "../models/note.model";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    const { type, sourceData } = payload;
    const { link } = sourceData
    const messages = []
    if (link) messages.push(geminiHelper.getFileURLMessage(link));
    const system = promptConstant.systemPrompt[type];
    const structureOutput = structureOutputJSONSchema[type];

    // Initialize Empty New Note 
    const notesData = {
      transcript: "",
      content: "",
      language: "",
      title: "",
      metaData: {},
      source: { type, link }
    };

    // Handel Types
    switch (type) {
      case "youtube":
        const res = await geminiHelper.getNotesResponse(system, messages, structureOutput);
        const ytNote = JSON.parse(res as string);
        notesData["content"] = ytNote.note
        notesData["transcript"] = ytNote.transcriptOfVideo
        notesData["title"] = ytNote.noteTitle
        notesData["metaData"] = ytNote.metaData
        notesData["language"] = ytNote.language
        console.log('NewNotesAIRes',ytNote)
        break;
    }
    const newNote = await NoteModel.create({ ...notesData, createdBy: userId })
    return newNote;
  } catch (error) {
    throw error
  }
}

const getAllNotes = async(userId:string)=>{
  try {
    const notes = await NoteModel.find({createdBy:userId});
    return notes
  } catch (error) {
    throw error
  }
}

export default { newNote,getAllNotes }