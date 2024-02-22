import {validateProduct, setId, validateAllowedFields} from '../../../helpers/dataHelpers.js'
import {ProductModel} from '../models/products.model.js'
class ProductManager {
    requiredProductFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnail']
    async getProducts()  {
        try {
            const products = await ProductModel.find()
            return {payload: products}
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`)
        }
    }

    async getProductById(id) {
        if (!id) {
            return {error: 'Id is required'}
        }
        try {
            const product = await ProductModel.findById(id)
            return product ? {payload: product} : {error: 'Product not found'}
        } catch (error) {
            throw new Error(`Error getting product by id: ${error.message}`)
        }
    }

    async addProduct(product) {
        try {
            // const {error: validationResult} = validateProduct(product, this.requiredProductFields)
            // if (validationResult) {
            //     return {error: validationResult}
            // }
            const newProduct = new ProductModel(product)
            await newProduct.save()
            return {payload: `Product added successfully with id ${newProduct._id}`}
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`)
        }
    }

    async updateById(id, product) {
        if (!id) {
            return {error: 'Id is required'}
        }
        try {
            const {error: validationResult} = validateAllowedFields(product, this.requiredProductFields)
            if (validationResult) {
                return {error: validationResult}
            }
            await ProductModel.findByIdAndUpdate(id, product)
            return {payload: `Product updated successfully with id ${id}`}
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`)
        }
    }

    async deleteById(id) {
        console.log("Hola")
        if (!id) {
            return {error: 'Id is required'}
        }
        console.log(id + "desde el manager")
        try {
            await ProductModel.findByIdAndDelete(id)
            return {payload: `Product deleted successfully with id ${id}`}
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`)
        }
    }
}

export {ProductManager}