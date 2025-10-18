import mongoose from 'mongoose';
import dotenv  from 'dotenv';
dotenv.config();

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const TagSchema = new Schema({
    title: { type: String ,required: true},
});

//const contentTypes = ['image', 'video', 'article', 'audio'];

const ContentSchema = new Schema({
    type: { type: String },
    title: { type: String, required: true },
    link: { type: String, required: true},
    tags: [{ type: ObjectId, ref: 'Tag' }],
    userId: { type: ObjectId, required: true, ref: 'User' },
});

const LinkSchema  = new Schema({
    userId: { type: ObjectId, ref: 'User', required:true, unique: true},
    hash: { type: String }
})

export const User = mongoose.model('User', UserSchema);
export const Tag = mongoose.model('Tag', TagSchema);
export const Link = mongoose.model('Link', LinkSchema);
export const Content = mongoose.model('Content', ContentSchema);