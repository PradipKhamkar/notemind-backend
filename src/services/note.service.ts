import { INewNotePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import structureOutputJSONSchema from "../constants/structure.constant";
import { NoteModel } from "../models/note.model";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    const { type, sourceData } = payload;
    const { link, fileId } = sourceData
    const messages = []
    if (link) messages.push(geminiHelper.getFileURLMessage(link));
    const system = promptConstant.systemPrompt[type];
    const structureOutput = structureOutputJSONSchema[type];
    console.log('payload', payload, messages)
    // Initialize Empty New Note 
    const notesData = {
      transcript: "",
      content: "",
      language: "",
      title: "",
      metaData: {},
      source: { type, link }
    };

    const res = await geminiHelper.getNotesResponse(system, messages, structureOutput);
    const aiStructureOutput = JSON.parse(res as string);
    notesData["title"] = aiStructureOutput.noteTitle
    notesData["content"] = aiStructureOutput.note
    notesData["metaData"] = aiStructureOutput.metaData
    notesData["language"] = aiStructureOutput.language
    console.log('aiStructureOutput', aiStructureOutput);

    // Handel Types
    switch (type) {
      case "youtube":
        notesData["transcript"] = aiStructureOutput.transcriptOfVideo
        console.log('NewNotesAIRes', aiStructureOutput)
        break;
      case "pdf":
        notesData["transcript"] = aiStructureOutput.documentText;
        await geminiHelper.deleteFile(fileId as string)
        break
    }
    const newNote = await NoteModel.create({ ...notesData, createdBy: userId })
    return newNote;
  } catch (error) {
    console.log('Error In Create Note', error)
    throw error
  }
}

const getAllNotes = async (userId: string) => {
  try {
    const notes = await NoteModel.find({ createdBy: userId });
    return notes
  } catch (error) {
    throw error
  }
}

export default { newNote, getAllNotes }