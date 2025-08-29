import express from "express"
import { v2 as cloudinary } from 'cloudinary'
const app = express();

app.use(express.json());

export default app;
