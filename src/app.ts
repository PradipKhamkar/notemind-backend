import express from "express";
import { app, httpServer } from "./socket/server";

app.use(express.json());

import noteRoute from "./routes/note.route";
import authRoute from "./routes/auth.route";
import Authenticate from "./middleware/Authenticate";

app.use('/notes', Authenticate, noteRoute);
app.use('/auth', authRoute);

export default httpServer;
