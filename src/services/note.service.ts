import { INewNotePayload, INote } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import { NoteModel } from "../models/note.model";
import FolderModel from "../models/folder.model";
import { responseFormat } from "../constants/structure.constant";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    const { type, sourceData } = payload;
    const { link, fileId, originalPath, uploadId } = sourceData
    const messages = []
    if (link) messages.push(geminiHelper.getFileURLMessage(link));
    const system = promptConstant.systemPrompt[type];

    // Initialize Empty New Note 
    const notesData = {
      language: "",
      transcript: [],
      title: "",
      metaData: {},
      keyPoints: [],
      summary: "",
      sections: [],
      source: { type, link, uploadId }
    };

    const res = await geminiHelper.getNotesResponse(system, messages, responseFormat);
    const aiStructureOutput = JSON.parse(res as string);
    notesData["title"] = aiStructureOutput.title;
    notesData["summary"] = aiStructureOutput.summary;
    notesData["metaData"] = aiStructureOutput?.metaData;
    notesData["language"] = aiStructureOutput.language;
    notesData["keyPoints"] = aiStructureOutput.key_points;
    notesData["sections"] = aiStructureOutput.sections;
    notesData["transcript"] = aiStructureOutput?.transcript || [];

    console.log('aiStructureOutput', aiStructureOutput);
    if (originalPath) notesData["source"]["link"] = originalPath;
    if (fileId) await geminiHelper.deleteFile(fileId as string);

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
    const folders = await FolderModel.find({ createdBy: userId }).select('-createdBy');
    return { notes, folders }
  } catch (error) {
    throw error
  }
}

const updateNote = async (noteId: string, payload: INote, userId: string) => {
  try {
    // @ts-ignore
    delete payload["_id"];
    const note = await NoteModel.findOneAndUpdate({ createdBy: userId, _id: noteId }, payload, { returnDocument: "after" });
    if (!note) throw new Error('Note Not Found!')
    console.log('Updated Note::', note);
    return note
  } catch (error) {
    throw error
  }
}

const deleteNote = async (noteId: string, userId: string) => {
  try {
    const note = await NoteModel.findByIdAndDelete({ createdBy: userId, _id: noteId });
    if (!note) throw new Error("Note Not Found!");
    return
  } catch (error) {
    throw error
  }
}

export default { newNote, getAllNotes, updateNote, deleteNote }