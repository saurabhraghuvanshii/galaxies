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
// Connect to MongoDB with proper error handling and options
const mongooseOptions = {
    // These options help with authentication and connection stability
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    // If authSource is not in the URI, try to add it
    // This helps with authentication for operations
};
// Parse the URI to check if it has authentication
const uriHasAuth = exports.mongoUri.includes('@') && (exports.mongoUri.includes('://') && exports.mongoUri.split('://')[1].includes('@'));
if (!uriHasAuth) {
    console.warn("⚠️  Warning: MongoDB URI doesn't appear to have authentication credentials!");
    console.warn("Your connection string should include username and password.");
    console.warn("Format: mongodb://username:password@host:port/database?authSource=admin");
}
mongoose_1.default.connect(exports.mongoUri, mongooseOptions)
    .then(() => {
    console.log("Connected to MongoDB successfully");
    // Test the connection with a simple operation
    if (mongoose_1.default.connection.db) {
        mongoose_1.default.connection.db.admin().ping()
            .then(() => {
            console.log("MongoDB authentication verified - connection is ready for operations");
        })
            .catch((pingError) => {
            if (pingError.code === 13 || pingError.codeName === 'Unauthorized') {
                console.error("\n❌ MongoDB Authentication Failed!");
                console.error("Connection succeeded but operations require authentication.");
                console.error("Please check your MONGO_URI includes username:password");
                console.error("Example: mongodb://username:password@host:port/database?authSource=admin\n");
            }
        });
    }
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
    if (error.code === 13 || error.codeName === 'Unauthorized') {
        console.error("\n❌ MongoDB Authentication Error!");
        console.error("Your MongoDB connection string needs authentication credentials.");
        console.error("Format should be: mongodb://username:password@host:port/database?authSource=admin");
        console.error("Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database");
        console.error("\nPlease check your .env file and update MONGO_URI with correct credentials.\n");
    }
    process.exit(1);
});
exports.JWT_SECRET = process.env.JWT_SECERT || "defaultSecretKey";
