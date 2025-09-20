import mongoose from "mongoose";
import config from "../config";

const connectDB = async()=>{
  try {
    const {DATABASE_USERNAME,DATABASE_PASSWORD,DATABASE_NAME} = config.DB
    console.log('config.DB',config.DB)
    const connectionInstance = await mongoose.connect(`mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@qa-notesai.zojp6ar.mongodb.net/${DATABASE_NAME}`);
    console.log('MongoDB Connected Successfully 🤩')
  } catch (error) {
    console.log('Failed To Connect MongoDB ☹️',error)
    throw error
  }
}

export default connectDB