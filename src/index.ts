import env from "dotenv";
env.config();
import connectDB from "./utils/dbConnection";
import config from "./config";
import app from "./app";

connectDB().then(()=>{
  app.listen(8080,()=>console.log("Server is running on port 8080 🏃"));
}).catch((err)=>{
});
