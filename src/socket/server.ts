import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"
import socketConstant from "../constants/socket.constant";
import noteService from "../services/note.service";
import { INewNotePayload, INoteTranslatePayload } from "../types/note.type";
import AuthenticateSocket from "../middleware/AuthenticateSocket";
import { IUser } from "../types/user.type";
import { IAskNotePayload, ISocketResponse } from "../types/llm.type";
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
});

io.use(AuthenticateSocket);

io.on("connect", (socket) => {
  // @ts-ignore
  const user: IUser = socket.user;
  const { noteJob, translate, askNote } = socketConstant.events;

  socket.on(noteJob.job_added, async (payload: INewNotePayload) => {
    try {
      console.log('new note event catch')
      socket.emit(noteJob.job_started)
      const newNote = await noteService.newNote(user._id, payload);
      socket.emit(noteJob.job_done, newNote)
    } catch (error: any) {
      socket.emit(noteJob.job_failed, error?.message)
    }
  });

  socket.on(translate.job_added, async (payload: INoteTranslatePayload) => {
    try {
      socket.emit(translate.job_started)
      console.log('new translate event catch');
      const translatedNote = await noteService.translateNote(payload, user._id);
      socket.emit(translate.job_added, translatedNote)
    } catch (error) {
      socket.emit(translate.job_failed, error)
    }
  });
  socket.on(askNote.query, async (payload: IAskNotePayload) => {
    try {
      await noteService.askNote(socket, user._id, payload.noteId, payload.query);
    } catch (error: any) {
      socket.emit(askNote.message, { content: { message: error.message || "error occurred" }, type: "error" } as ISocketResponse);
      console.log('Error inside ask note::', error)
    }
  })
});


export { app, io, httpServer }