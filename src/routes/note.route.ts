import express from "express";
import noteController from "../controller/note.controller";
const route = express.Router();

route.get('/',noteController.getAllNotes);
route.put('/',noteController.updateNote);

export default route