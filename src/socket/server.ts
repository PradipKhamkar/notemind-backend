import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"
import socketConstant from "../constants/socket.constant";
import noteService from "../services/note.service";
import { INewNotePayload, INoteTranslatePayload } from "../types/note.type";
import AuthenticateSocket from "../middleware/AuthenticateSocket";
import { IUser } from "../types/user.type";
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
});

io.use(AuthenticateSocket);

io.on("connect", (socket) => {
  // @ts-ignore
  const user: IUser = socket.user;
  const { noteJob, translate } = socketConstant.events;

  socket.on(noteJob.job_added, async (payload: INewNotePayload) => {
    try {
      console.log('new note event catch')
      socket.emit(noteJob.job_started)
      const newNote = await noteService.newNote(user._id, payload);
      socket.emit(noteJob.job_done, newNote)
    } catch (error) {
      socket.emit(noteJob.job_failed, error)
    }
  });

  socket.on(translate.job_added, async (payload: INoteTranslatePayload) => {
    try {
      socket.emit(translate.job_started)
      console.log('new note event catch');
      const translatedNote = await noteService.translateNote(payload, user._id);
      socket.emit(translate.job_added, translatedNote)
    } catch (error) {
      socket.emit(translate.job_failed, error)
    }
  });
});


export { app, io, httpServer }