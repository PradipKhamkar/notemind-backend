import express, { Request, Response } from "express";
import fileService from "../services/file.service";
const router = express.Router();

router.post('/',async(req:Request,res:Response)=>{
  try {
    // @ts-ignore
    console.log('req::',req.files.file);
    // @ts-ignore
    const a = await fileService.uploadFile(req.files.file,"");
    console.log('A::',a)
     res.json().status(200)
  } catch (error) {
    res.json().status(400)
  }
})


export default router