import env from "dotenv";
env.config();
import connectDB from "./utils/dbConnection";
import httpServer from "./app";
const PORT  = process.env.PORT || 8080
connectDB().then(()=>{
  httpServer.listen(PORT,()=>console.log("Server is running on port 8080 🏃"));
}).catch((err)=>{
});