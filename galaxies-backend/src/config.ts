import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config();

export const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose.connect(mongoUri);


export const JWT_SECRET = process.env.JWT_SECERT || "defaultSecretKey"; 