import env from "dotenv";
env.config();
import app from "./app";
import connectDB from "./utils/dbConnection";

connectDB().then(()=>{
  app.listen(8080,()=>console.log("Server is running on port 8080 🏃"));
}).catch((err)=>{
});