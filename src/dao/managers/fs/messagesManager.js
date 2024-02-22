import {promises as fs} from 'fs'

class MessagesManager {
    constructor(path) {
        this.path = path
    }

    async getAll ()  {
        console.log('entro el getAll')
        try {
            const messages = await fs.readFile(this.path, 'utf-8')
            console.log('messages', messages)
            return {status: 'success', payload: JSON.parse(messages)}
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {payload: []}
            }
            throw new Error(`Error getting products: ${error.message}`)
        }
    }

    async save (message) {
        console.log('entro el save')
        console.log(message)
        if (!message) return {status: 'error', error: 'missing message'}

        try {
            const {payload: messages} = await this.getAll()
            console.log('messages: ', messages + ' ' + typeof messages)
            messages.push(message)
            await fs.writeFile(this.path, JSON.stringify(messages))
        } catch (error) {
            throw new Error(`Error adding message: ${error.message}`)
        }
    }
}

export default MessagesManager;