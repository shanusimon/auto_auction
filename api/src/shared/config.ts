import dotenv from "dotenv";
import path from "path"
dotenv.config({path:path.resolve(__dirname,"../.env")});
import * as admin from "firebase-admin";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.resolve(__dirname, "../../auto-auction-ce674-firebase-adminsdk-fbsvc-7aa3c3be76.json");
console.log('config.js: Loaded STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...');

let serviceAccount: admin.ServiceAccount;

try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("Failed to load Firebase service account:", error);
  throw new Error("Firebase Admin SDK initialization failed due to missing or invalid service account file");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();

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
    jwt:{
        ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || "access-secret-key",
		REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY || "refresh-secret-key",
		ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
		REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        RESET_SECRET_KEY:process.env.JWT_RESET_KEY || "reset-secret-key",
        RESET_EXPIRES_IN:process.env.JWT_RESET_EXPIRES_IN || "5m"
    },
    loggerStatus: process.env.LOGGER_STATUS || "dev",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
    stripe:{
        STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_KEY
    }
}