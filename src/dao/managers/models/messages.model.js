import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true }
})

export const MessageModel = mongoose.model('messages', messagesSchema)