import { INewNotePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import structureOutputJSONSchema from "../constants/structure.constant";

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
      transcribe: "",
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
        notesData["transcribe"] = ytNote.transcriptOfVideo
        notesData["title"] = ytNote.noteTitle
        notesData["metaData"] = ytNote.metaData
        notesData["language"] = ytNote.language
        return JSON.parse(res as string);
        break;
    }

    return notesData
  } catch (error) {
    throw error
  }
}

export default { newNote }