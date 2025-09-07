import express from "express";
import folderController from "../controller/folder.controller";
const route = express.Router();

route.post('/',folderController.create);

export default route