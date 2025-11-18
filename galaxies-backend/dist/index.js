"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            message: "Username and password are required",
        });
        return;
    }
    try {
        // Check if user already exists
        const existingUser = yield db_1.User.findOne({ username });
        if (existingUser) {
            res.status(409).json({
                message: "Username already exists",
            });
            return;
        }
        yield db_1.User.create({
            username,
            password,
        });
        res.json({
            message: "signup successful",
        });
    }
    catch (e) {
        console.error("Signup error:", e);
        // Check if MongoDB is connected
        if (mongoose_1.default.connection.readyState !== 1) {
            res.status(503).json({
                message: "Database connection error",
                error: "Database is not connected. Please try again later.",
            });
            return;
        }
        // Handle duplicate key error
        if (e.code === 11000) {
            res.status(409).json({
                message: "Username already exists",
            });
            return;
        }
        res.status(500).json({
            message: "signup failed",
            error: e.message,
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_1.User.findOne({ username, password });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
            res.json({ message: "Signin successful", token });
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (e) {
        res.json({
            message: "sign failed",
            error: e.message
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type } = req.body;
    try {
        yield db_1.Content.create({
            link,
            type,
            title: req.body.title,
            userId: req.userId,
            tags: [],
        });
        res.json({ message: "Content added successfully" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error adding content", error: e.message });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({
                message: "User ID not found",
            });
            return;
        }
        const content = yield db_1.Content.find({
            userId: userId,
        }).populate("userId", "username");
        res.json({
            content,
        });
    }
    catch (e) {
        console.error("Content fetch error:", e);
        res.status(500).json({
            message: "Error fetching content",
            error: e.message,
        });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.Content.deleteMany({
        contentId,
        userId: req.userId,
    });
    res.json({
        message: "Deleted",
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.Link.findOne({
            userId: req.userId,
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = (0, utils_1.random)(5);
        yield db_1.Link.create({
            userId: req.userId,
            hash: hash,
        });
        res.json({
            hash,
        });
    }
    else {
        yield db_1.Link.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.Link.findOne({
        hash
    });
    if (!link) {
        res.status(404).json({
            message: "not found"
        });
        return;
    }
    const content = yield db_1.Content.find({
        userId: link.userId
    });
    //console.log(link);
    const user = yield db_1.User.findOne({
        _id: link.userId
    });
    res.json({
        username: user === null || user === void 0 ? void 0 : user.username,
        content: content
    });
}));
// Serve static files from the frontend dist folder
app.use(express_1.default.static(path_1.default.join(__dirname, "../../galaxies-frontend/dist")));
// Catch-all handler: send back React's index.html file for client-side routing
app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
        res.status(404).json({ message: "API endpoint not found" });
        return;
    }
    res.sendFile(path_1.default.join(__dirname, "../../galaxies-frontend/dist/index.html"));
});
// Wait for MongoDB connection before starting server
const startServer = () => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};
if (mongoose_1.default.connection.readyState === 1) {
    // Already connected
    console.log('MongoDB connection is ready');
    startServer();
}
else {
    // Wait for connection
    mongoose_1.default.connection.once('open', () => {
        console.log('MongoDB connection is ready');
        startServer();
    });
}
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
