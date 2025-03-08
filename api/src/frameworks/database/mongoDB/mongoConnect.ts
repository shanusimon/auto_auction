import mongoose from "mongoose";
import { config } from "../../../shared/config";


export class MongoConnect{
    private _dbUrl:string;
    constructor(){
        this._dbUrl = config.database.URI
    }
    async connectDB(){
        try {
            await mongoose.connect(this._dbUrl);
            console.log("DataBase Connected")
        } catch (error) {
            console.error("failed to connect MongoDB",error);
            throw new Error("Database connection failed");
        }
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
    
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
    }
}