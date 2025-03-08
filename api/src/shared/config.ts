import dotenv from "dotenv";
import path from "path"
dotenv.config({path:path.resolve(__dirname,"../../.env")});



export const config ={
    cors:{
        ALLOWED_ORGIN:
           process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173"
    },
    database:{
        URI:process.env.MONGO_URI || ""
    },
    server:{
        PORT:process.env.PORT || 5000,
        NODE_ENV:process.env.NODE_ENV || "development",
    },
    loggerStatus: process.env.LOGGER_STATUS || "dev",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10)
}