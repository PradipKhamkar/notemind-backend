import express from "express";
import noteController from "../controller/note.controller";
const route = express.Router();

route.post('/',noteController.newNote);

export default route