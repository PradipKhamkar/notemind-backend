import { INewNotePayload, INote, INoteTranslatePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import { NoteModel } from "../models/note.model";
import FolderModel from "../models/folder.model";
import structureConstant, { responseFormat } from "../constants/structure.constant";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    const { type, sourceData } = payload;
    const { link, fileId, originalPath, uploadId } = sourceData
    const messages = []
    if (link) messages.push(geminiHelper.getFileURLMessage(link));
    const system = promptConstant.systemPrompt[type];

    // @ts-ignore
    const notesData: INote = {}

    const res = await geminiHelper.getNotesResponse(system, messages, responseFormat);
    const aiStructureOutput = JSON.parse(res as string);
    notesData["title"] = aiStructureOutput.title;
    notesData.data = [{
      language: aiStructureOutput.language,
      content: {
        keyPoints: aiStructureOutput.key_points,
        sections: aiStructureOutput.sections,
        summary: aiStructureOutput.summary
      }
    }];
    notesData.metaData = aiStructureOutput?.metaData;
    notesData.transcript = aiStructureOutput?.transcript || [];
    notesData.source = { type, link, uploadId }

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

const translateNote = async (payload: INoteTranslatePayload, userId: string) => {
  try {
    const note = await NoteModel.findOne({ _id: payload.noteId, createdBy: userId });
    if (!note) throw new Error('note not found!');
    console.log('generate note called!')
    const { sourceLanguage, targetLanguage } = payload.data
    const sourceNoteContent = note.data.find((d) => d.language === sourceLanguage);
    if (!sourceNoteContent) throw new Error('source content not found!');

    const messages = [{
      text: `
      noteData:${JSON.stringify(sourceNoteContent)}
      source_language:${sourceLanguage}
      target_language:${targetLanguage}`
    }];

    const res = await geminiHelper.getNotesResponse(promptConstant.translateNote, messages, structureConstant.translate);
    const { key_points, sections, summary } = JSON.parse(res as string);
    const content = { content: { keyPoints: key_points, sections, summary }, language: targetLanguage, }
    note.data = [...note.data, content];
    await note.save();
    console.log('ai response',content)
    return {
      updatedNote: note,
      content: content
    }
  } catch (error) {
    throw error
  }
}

export default { newNote, getAllNotes, updateNote, deleteNote, translateNote }