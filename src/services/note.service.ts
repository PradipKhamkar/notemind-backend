import { INewNotePayload, INote, INoteTranslatePayload } from "../types/note.type";
import geminiHelper from "../helper/gemini.helper";
import promptConstant from "../constants/prompt.constant";
import { NoteModel } from "../models/note.model";
import FolderModel from "../models/folder.model";
import structureConstant, { responseFormat } from "../constants/structure.constant";
import noteHelper from "../helper/note.helper";
import { Socket } from "socket.io";
import socketConstant from "../constants/socket.constant";
import { IMessage, ISocketResponse } from "../types/llm.type";

const newNote = async (userId: string, payload: INewNotePayload) => {
  try {
    await noteHelper.checkUserQuota(userId);

    // === Input prep ===
    const { type, sourceData } = payload;
    const { link, fileId, originalPath, uploadId } = sourceData;
    const messages = [];
    if (link) messages.push(geminiHelper.getFileURLMessage(link));
    const system = promptConstant.systemPrompt[type];

    // @ts-ignore
    const notesData: INote = {};
    const aiStructureOutput = await geminiHelper.getNotesResponse(system, messages, responseFormat);

    // === Map response into DB schema ===
    notesData["title"] = aiStructureOutput.title;
    notesData.data = [
      {
        language: 'default',
        content: {
          keyPoints: aiStructureOutput.key_points,
          sections: aiStructureOutput.sections,
          summary: aiStructureOutput.summary,
        },
      },
    ];
    notesData.metaData = aiStructureOutput?.metaData;
    notesData.source = { type, link, uploadId };
    notesData.suggestionQuery = aiStructureOutput.suggestionQuery;
    
    if (originalPath) notesData["source"]["link"] = originalPath;
    if (fileId) geminiHelper.deleteFile(fileId as string)

    // Save note
    const newNote = await NoteModel.create({ ...notesData, createdBy: userId });
    return newNote;
  } catch (error) {
    console.log("Error In Create Note", error);
    throw error;
  }
};

const getAllNotes = async (userId: string) => {
  try {
    const notes = await NoteModel.find({ createdBy: userId }).select('-createdBy');;
    const folders = await FolderModel.find({ createdBy: userId }).select('-createdBy').sort({ order: 1 });
    return { notes, folders }
  } catch (error) {
    throw error
  }
}

const updateNote = async (noteId: string, payload: Partial<INote>, userId: string) => {
  try {
    const setOperations: any = {};
    const arrayFilters: any[] = [];

    // handle `data` updates (translations)
    if (payload.data && Array.isArray(payload.data)) {
      payload.data.forEach((entry, i) => {
        setOperations[`data.$[elem${i}].content`] = entry.content;
        arrayFilters.push({ [`elem${i}.language`]: entry.language });
      });
    }

    // handle other top-level fields dynamically
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== "data" && key !== "_id") {
        setOperations[key] = value;
      }
    });

    const note = await NoteModel.findOneAndUpdate(
      { createdBy: userId, _id: noteId },
      { $set: setOperations },
      {
        new: true,
        arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
      }
    );

    if (!note) throw new Error("Note not found!");
    return note;

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
    const { key_points, sections, summary } = res || {}
    const content = { content: { keyPoints: key_points, sections, summary }, language: targetLanguage, }
    note.data = [...note.data, content];
    await note.save();
    return {
      updatedNote: note,
      content: content
    }
  } catch (error) {
    console.log('err', error)
    throw error
  }
}

const askNote = async (socket: Socket, userId: string, noteId: string, query: string) => {
  const { askNote } = socketConstant.events
  try {
    socket.emit(askNote.message, {
      type: "pull_db",
      content: { message: "Retrieving Note..." }
    } as ISocketResponse);

    const noteInfo = await NoteModel.findOne({ _id: noteId, createdBy: userId });
    if (!noteInfo) throw new Error("Note Not Found!")
    const noteContext = noteInfo.data.find((d) => d.language === "default")?.content;

    socket.emit(askNote.message, {
      type: "thinking",
      content: { message: "Reading Note..." }
    } as ISocketResponse);

    const metaContext = {
      source:noteInfo.source,
    }
    // start stream
   const systemInstruction = `You are an intelligent AI assistant specialized in helping users understand, analyze, and work with their personal notes.

## Your Core Capabilities:
- Analyze and interpret the user's notes with deep contextual understanding
- Answer questions directly based on note content
- Generate insights, summaries, and connections from their notes
- Maintain the user's writing style and tone when creating content
- Provide actionable suggestions and helpful expansions

## Note Context:
${JSON.stringify(noteContext, null, 2)}

## Note Metadata:
${JSON.stringify(metaContext, null, 2)}

## Response Guidelines:
1. **Prioritize Note Content**: Always reference and quote from the note when answering questions. Use specific examples and details from the note.

2. **When Information is Available**:
   - Cite specific sections from the note
   - Provide direct answers with context
   - Connect related ideas within the note
   - Highlight key insights or patterns

3. **When Information is Missing**:
   - Clearly state what's not in the note
   - Offer general knowledge or suggestions
   - Ask clarifying questions if helpful
   - Suggest what could be added to the note

4. **Content Generation**:
   - Match the user's writing style and tone
   - Build upon existing note content
   - Maintain consistency with note themes
   - Keep outputs practical and relevant

5. **Response Format**:
   - **ALWAYS use Markdown formatting**
   - Use headers, lists, bold, italic for clarity
   - Keep responses concise yet comprehensive
   - Structure information logically
   - Use code blocks for code/technical content

6. **Tone & Style**:
   - Be conversational yet professional
   - Show understanding of user's context
   - Be helpful without being verbose
   - Adapt to the user's communication style

Remember: You're not just answering questions—you're helping users think better with their notes.`

    const messages: IMessage[] = [...noteInfo.messages || [], { role: "user", content: query }];
    const streamRes = await geminiHelper.streamResponse(messages, systemInstruction);

    // streaming ai response;
    let finalText = ""
    for await (let chunk of streamRes) {
      const textRes = chunk.text
      if (textRes) {
        finalText += chunk.text
        socket.emit(askNote.message, {
          type: "text",
          content: { message: chunk.text }
        } as ISocketResponse);
      }
    }

    console.log('finalText',finalText)
    socket.emit(askNote.message, { content: { message: finalText }, type: "completed" } as ISocketResponse);

    // store chat history
    messages.push({ role: "assistant", content: finalText });
    noteInfo.messages = messages;
    await noteInfo.save();
    return {}
  } catch (error: any) {
    throw error
  }
}

export default { newNote, getAllNotes, updateNote, deleteNote, translateNote, askNote }