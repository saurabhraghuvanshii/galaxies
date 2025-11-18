"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        if (!header) {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }
        // Handle "Bearer token" format or just "token"
        let token = header;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        // Validate token format (should not be empty)
        if (!token || token.trim() === "") {
            res.status(403).json({
                message: "Invalid token format"
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        console.error("JWT verification error:", e.message);
        res.status(403).json({
            message: "You are not logged in",
            error: e.message
        });
    }
};
exports.userMiddleware = userMiddleware;
