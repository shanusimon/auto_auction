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
        PORT:process.env.PORT || 5003,
        NODE_ENV:process.env.NODE_ENV || "development",
    },
    nodemailer:{
        EMAIL_USER:process.env.SMTP_USER,
        EMAIL_PASS:process.env.SMTP_PASS
    },
    redis:{
        redisURL:process.env.REDIS_URL
    },
    loggerStatus: process.env.LOGGER_STATUS || "dev",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10)
}