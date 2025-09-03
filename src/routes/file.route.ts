import express from "express";
import fileService from "../services/file.service";
import fileController from "../controller/file.controller";
const route = express.Router();


route.post('/',fileController.uploadFile);

