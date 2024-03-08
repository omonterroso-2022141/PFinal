'use strict'

import { checkUpdate } from '../../utils/validator.js'
import Category from './category.model.js'
import Product from '../product/producto.model.js'


export const categoryDefault = async(req, res)=>{
    try{
        let exist = await Category.findOne({name:'DEFAULT'})
        if(!exist){
            let data = {
                nameCategory: 'DEFAULT',
                description: 'Default category'
            }
            let category = new Category(data)
            await category.save()
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error category could not be added',err})
    }
}

export const saveCategory = async(req, res) =>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()

        return res.send({message: 'Category save successfully'})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving Category'})
        
    }
}

export const listCategory = async (req, res) =>{
    try {

        let categorys = await Category.find()
        return res.send({ categorys })

        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting category'})
        
    }
}

export const updateCategory = async(req, res) => {
    try {

        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have sumbitted some data that cannot be updated or missing data'})
        let updateCategory = await Category.findOneAndUpdate(
            
            { _id: id},
            data,
            { new: true}

            )
            if(!updateCategory) return res.status(401).send({message: 'Category not found and not updated'})
            return res.send({message: 'Update Category', updateCategory})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating category'})
        
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findOneAndDelete({ _id: id });

        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found and not deleted' });
        }


        await Product.updateMany({ category: id }, { category: 'DEFAULT' });

        return res.send({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Category' });
    }
};
