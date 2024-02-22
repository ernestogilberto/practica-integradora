import express from 'express'
import mongoose from 'mongoose';
import {create} from 'express-handlebars'
import {Server} from 'socket.io'
import {router as productsRouter} from './routes/products.router.js'
import {router as cartsRouter} from './routes/carts.router.js'
import {router as viewsRouter} from './routes/views.router.js'
import {__dirname} from './utils.js'

// import {ProductManager} from './dao/managers/fs/productManager.js'
import {ProductManager} from './dao/managers/db/productManager.js'
// import messagesManager from './dao/managers/fs/messagesManager.js';
import messagesManager from './dao/managers/db/messagesManager.js';

const manager = new ProductManager(__dirname + '/db/products.json')
const msgManager = new messagesManager(__dirname + '/db/messages.json')

const app = express()
const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

mongoose.connect('mongodb+srv://ernestogilberto:coderhouse@cluster0.gnfbmpg.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
      console.log('Conectado a la base de datos');
  }).catch(err => console.log(err));

const hbs = create({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials',

    helpers: {
        toFixed: (value, precision) => {
            return value.toFixed(precision)
        }
    }
})

const socketServer = new Server(httpServer)

app.engine('.hbs', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', '.hbs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
// app.use('/api/chat', chatRouter)
app.use('/', viewsRouter)

socketServer.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('new-product', async (data) => {
        await manager.addProduct(data)
        const {payload: products} = await manager.getProducts()
        socketServer.emit('products', products)
    })
    socket.on('delete-product', async (id) => {
        console.log(id + "desde el app")
        await manager.deleteById(id)
        const {payload: products} = await manager.getProducts()
        socketServer.emit('products', products)
    })
    socket.on('newUser', async (data) => {
        let messages = []
        await msgManager.getAll().then(res => {
            messages = res.payload
        })
        socket.emit('history', messages);
        socket.broadcast.emit('alert', data);
    })
    socket.on('chat message', async data => {
        let date = new Date();
        let currentDate = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        await msgManager.save({userId: data.user, message: data.message, date: currentDate})
        let messages = []
        await msgManager.getAll().then(res => {
            messages = res.payload
        })
        socketServer.emit('history', messages);
    })
})