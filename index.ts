import express from "express";
import DBconnection from "./models/connextion";
import dotenv from "dotenv";

DBconnection()
const app = express();
app.use(express.json());

dotenv.config()
app.listen(3000,()=>{
    console.log("sever is runing on port 3000");
});