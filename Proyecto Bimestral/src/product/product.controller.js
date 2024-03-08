'use strict'

import { checkUpdate } from '../../utils/validator.js'
import Product from './producto.model.js'
import Category from '../category/category.model.js'


export const saveProduct = async (req, res) => {
    try {
        let data = req.body;
        let category = await Category.findOne({ _id: data.category });

        if (!category) 
            return res.status(404).send({ message: 'Not exist category' });

        if (isNaN(data.price) || isNaN(data.stock)) 
            return res.status(402).send({ message: 'please just put numbers in stock' });

        if (!data.category) 
            data.category = req.categoryDefault.id;
        
        let product = new Product(data);
        await product.save();
        return res.send({ message: 'Product saved' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error product no saved', err });
    }
};

export const listProduct = async(req, res) =>{
    try {

        let products = await Product.find().populate('category',['nameCategory', '-_id']).select('-__v')
        return res.send({ products })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error system '})
    }
}

export const productNoStock = async(req, res)=>{
    try{
        let nostock = await Product.find({stock: '0'}).populate('category',['nameCategory', '-_id']).select('-__v')
        return res.send({message: 'The products no stock: ', nostock})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error system'}) 
    }
}

export const productSearchCategory = async(req, res)=>{
    try{
        let { id } = req.params
        let category = await Category.findOne({_id: id})
        if(!category) return res.status(404).send({message: 'Not exist this category'})
        let all = await Product.find({category: id}).populate('category',['nameCategory', '-_id']).select('-__v')
        if(all.length == '0') return res.status(404).send({message: `There are no products with this category: ${category.name}`})
        return res.send({message: `The products in this ${category.name} are:`, all})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'})
    }
}


export const getTopSellingProduct = async (req, res) => {
    try {

        const topSellingProduct = await Product.findOne().populate('category',['nameCategory', '-_id']).select('-__v')
            .sort('-sale') 
            .limit(1);


        if (!topSellingProduct) {
            return res.status(404).send({ message: 'No top selling product found' });
        }


        return res.send({ message: 'Top selling product', product: topSellingProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error retrieving top selling product' });
    }
};



export const searchProductAZ = async (req, res) => {
    try {

        const products = await Product.find().sort({ nameProduct: 1 });

        if (!products || products.length === 0) {
            return res.status(404).send({ message: 'No products found' });
        }


        return res.send({ message: 'Products found and sorted alphabetically', products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching and sorting products' });
    }
};

/*export const searchProductsName = async (req, res) => {
    try {
        const { searchTerm } = req.query;


        const product = await Product.find({ nameProduct: { $regex: searchTerm, $options: 'i' } });

        if (!product || product.length === 0) {
            return res.status(404).send({ message: 'No products found' });
        }

        return res.send(product);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching for products' });
    }
};
*/


export const updateProduct = async(req, res) => {
    try {

        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have sumbitted some data that cannot be updated or missing data'})
        let updateProduct = await Product.findOneAndUpdate(
            
            { _id: id},
            data,
            { new: true}

            )
            if(!updateProduct) return res.status(401).send({message: 'Product not found and not updated'})
            return res.send({message: 'Update Product', updateProduct})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating product'})
        
    }
}

export const deleteProduct = async (req, res) =>{
    try {

        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({ _id: id})
        if(!deletedProduct) return res.status(404).send({message: 'Product not found and not delete'})
        return res.send({message: 'Product delete successfully'})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting Product'})
        
    }
}