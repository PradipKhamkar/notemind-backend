import express from "express";
import expressFileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(expressFileUpload());

import fileRoute from "./routes/file.route";

app.use('/file',fileRoute);

export default app;
