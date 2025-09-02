import mongoose from "mongoose";
import dotenv from "dotenv";

const DBconnection = async ()=>{
    try {
        const dblink:string = process.env.dblink!;
        await mongoose.connect(dblink);
        // console.log("db conected sucsesfully");
    } catch (error) {
        console.log(error);
    }
}

export default DBconnection