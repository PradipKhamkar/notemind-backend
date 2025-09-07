import { INewNotePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import structureOutputJSONSchema from "../constants/structure.constant";
import { NoteModel } from "../models/note.model";
import FolderModel from "../models/folder.model";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    const { type, sourceData } = payload;
    const { link, fileId, originalPath, uploadId } = sourceData
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
      source: { type, link, uploadId }
    };

    const res = await geminiHelper.getNotesResponse(system, messages, structureOutput);
    const aiStructureOutput = JSON.parse(res as string);
    notesData["title"] = aiStructureOutput.noteTitle
    notesData["content"] = aiStructureOutput.note
    notesData["metaData"] = aiStructureOutput.metaData
    notesData["language"] = aiStructureOutput.language
    console.log('aiStructureOutput', aiStructureOutput);
    if (originalPath) notesData["source"]["link"] = originalPath;
    if (fileId) await geminiHelper.deleteFile(fileId as string);

    // Handel Types
    switch (type) {
      case "youtube":
        notesData["transcript"] = aiStructureOutput.transcriptOfVideo
        break;
      case "pdf":
        notesData["transcript"] = aiStructureOutput.documentText;
        break
      case "audio":
        notesData["transcript"] = aiStructureOutput.audioTranscript;
        break
      case "video":
        notesData["transcript"] = aiStructureOutput.videoTranscript;
        break
      default:
        throw new Error("Invalid source type!")
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
    const notes = await NoteModel.find({ createdBy: userId }).select('-createdBy');;
    const folders = await FolderModel.find({createdBy:userId}).select('-createdBy');
    return {notes,folders}
  } catch (error) {
    throw error
  }
}

export default { newNote, getAllNotes }