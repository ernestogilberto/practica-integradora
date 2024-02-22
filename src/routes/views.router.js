import express from 'express';
// import {ProductManager} from '../dao/managers/fs/productManager.js'
import {ProductManager} from '../dao/managers/db/productManager.js'
// import MessagesManager from '../dao/managers/fs/messagesManager.js';
import MessagesManager from '../dao/managers/db/messagesManager.js';
import {__dirname} from '../utils.js';

const manager = new ProductManager(__dirname + '/db/products.json');
const messagesManager = new MessagesManager(__dirname + '/db/messages.json');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let {limit} = req.query;
        const {payload, error} = await manager.getProducts();
        let products = await JSON.parse(JSON.stringify(payload));
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).render('home', {products: limit ? products.slice(0, limit) : products});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try {
        const {payload, error} = await manager.getProducts();
        let products = await JSON.parse(JSON.stringify(payload));
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).render('realTimeProducts', {products: products});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.post('/realTimeProducts', async (req, res) => {
    try {
        const product = req.body;
        await manager.addProduct(product);
        const {payload, error} = await manager.getProducts();
        let products = await JSON.parse(JSON.stringify(payload));
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).render( 'realTImeProducts' , {products: products});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.delete('/realTimeProducts/:pid', async (req, res) => {
    try {
        // let id = parseInt(req.params.pid);
        let id = req.params.pid;
        console.log('id', id)
        const {payload: deletedProduct, error} = await manager.deleteById(id);
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send(deletedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/chat', (req, res) => {
    const message = req.body;
    res.render('chat', {message})
})

router.post('/chat', (req, res) => {

})

export {router}