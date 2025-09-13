import express from "express";
import folderController from "../controller/folder.controller";
const route = express.Router();

route.post('/',folderController.create);
route.delete('/:id',folderController.remove);
route.put('/',folderController.update);

export default route