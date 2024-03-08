import ShoppingCart from './shopping.model.js'
import Product from '../product/producto.model.js'


export const shoppingCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        let { amount } = req.body;

        if (isNaN(amount)) {
            return res.status(400).send({ message: 'Enter how many you want in numbers, please' });
        }

        const productExist = await Product.findOne({ _id: id });
        if (!productExist) {
            return res.status(404).send({ message: 'The product does not exist' });
        }

        if (amount > productExist.stock) {
            return res.status(400).send({ message: 'There is no product' });
        }

        let exist = await ShoppingCart.findOne({ user: uid });
        const isNewCart = !exist;

        if (isNewCart) {
            const newCart = new ShoppingCart({
                user: uid,
                items: [{ product: id, quantity: amount }]
            });
            await newCart.save();
            return res.send({ message: 'Product added to shopping cart' });
        } else {
            const productIndex = exist.items.findIndex(item => item.product.equals(id));
            if (productIndex !== -1) {

                const newQuantity = parseInt(exist.items[productIndex].quantity) + parseInt(amount);
                exist.items[productIndex].quantity = newQuantity;

                
                if (newQuantity > productExist.stock) {
                    const added = productExist.stock - (newQuantity - amount);
                    return res.send({ message: `There is not enough product in stock ${added}` });
                }
            } else {

                exist.items.push({ product: id, quantity: amount });
            }
            await exist.save();
        }
        return res.send({ message: 'Product added to shopping cart' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error connecting to shopping Cart' });
    }
};

export const deleteShoppingCart = async (req, res) => {
    try {
        const { uid } = req.user;

 
        const deletedCart = await ShoppingCart.findOneAndDelete({ user: uid });

        if (!deletedCart) {
            return res.status(404).send({ message: 'Shopping cart not found' });
        }

        return res.send({ message: 'Shopping cart deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting shopping cart' });
    }
};