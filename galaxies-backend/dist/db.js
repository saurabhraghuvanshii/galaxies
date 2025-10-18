"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.Link = exports.Tag = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const TagSchema = new Schema({
    title: { type: String, required: true },
});
//const contentTypes = ['image', 'video', 'article', 'audio'];
const ContentSchema = new Schema({
    type: { type: String },
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'Tag' }],
    userId: { type: ObjectId, required: true, ref: 'User' },
});
const LinkSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true, unique: true },
    hash: { type: String }
});
exports.User = mongoose_1.default.model('User', UserSchema);
exports.Tag = mongoose_1.default.model('Tag', TagSchema);
exports.Link = mongoose_1.default.model('Link', LinkSchema);
exports.Content = mongoose_1.default.model('Content', ContentSchema);
