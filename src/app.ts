import express from "express";
import { app, httpServer } from "./socket/server";
import fileUpload = require("express-fileupload");
import cors from "cors";

app.use(express.json());
app.use(fileUpload());
app.use(cors());

import noteRoute from "./routes/note.route";
import authRoute from "./routes/auth.route";
import Authenticate from "./middleware/Authenticate";
import fileRoute from "./routes/file.route";

app.use('/notes', Authenticate, noteRoute);
app.use('/auth', authRoute);
app.use('/file', Authenticate, fileRoute);

export default httpServer;
