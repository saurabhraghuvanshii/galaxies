import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers["authorization"];

        if (!header) {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }

        // Handle "Bearer token" format or just "token"
        let token = header as string;
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

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }

        req.userId = (decoded as JwtPayload).id;
        next();
    } catch (e: any) {
        console.error("JWT verification error:", e.message);
        res.status(403).json({
            message: "You are not logged in",
            error: e.message
        });
    }
}
