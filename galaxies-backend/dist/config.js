"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.mongoUri = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
exports.mongoUri = process.env.MONGO_URI;
if (!exports.mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose_1.default.connect(exports.mongoUri);
exports.JWT_SECRET = process.env.JWT_SECERT || "defaultSecretKey";
