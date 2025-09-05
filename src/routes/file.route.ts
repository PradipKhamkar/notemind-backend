import express from "express";
import fileController from "../controller/file.controller";
const route = express.Router();


route.post('/',fileController.uploadFile);

export default route

