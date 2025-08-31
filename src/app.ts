import express from "express";
import expressFileUpload from "express-fileupload";
import { app } from "./socket/server";

app.use(express.json());

import fileRoute from "./routes/file.route";
import noteRoute from "./routes/note.route";
import authRoute from "./routes/auth.route";

app.use('/file',fileRoute);
app.use('/note',noteRoute);
app.use('/auth',authRoute);

export default app;
