import mongoose,{  Schema } from "mongoose";
import { IFile } from "../types/file.type";

const fileSchema = new Schema<IFile>({
  // @ts-ignore
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:"user",
    required:true,
  },
  size:{
    type:Number,
    required:true,
  },
  path:{
    type:String,
    required:true
  },
  uploadId:{
    type:String,
    required:true
  }
},{timestamps:true});

const FileModel = mongoose.model('files',fileSchema);
export default FileModel;
