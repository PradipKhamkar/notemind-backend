import env from "dotenv";
env.config();
import connectDB from "./utils/dbConnection";
import httpServer from "./app";

connectDB().then(()=>{
  httpServer.listen(8080,()=>console.log("Server is running on port 8080 🏃"));
}).catch((err)=>{
});
