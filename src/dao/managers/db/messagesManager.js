import {MessageModel} from '../models/messages.model.js';

class MessagesManager {
    async getAll() {
        try {
            const messages = await MessageModel.find()
            return {payload: messages}
        } catch (error) {
            throw new Error(`Error getting messages: ${error.message}`)
        }
    }

    async save(message) {
        try {
            const newMessage = new MessageModel(message)
            await newMessage.save()
            return {payload: `Message added successfully with id ${newMessage._id}`}
        } catch (error) {
            throw new Error(`Error adding message: ${error.message}`)
        }
    }
}

export default MessagesManager