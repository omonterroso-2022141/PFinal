import Bill from './bill.model.js'
import shoppingCart from '../shoppingCart/shopping.model.js'
import Product from '../product/producto.model.js'


export const listBill = async(req, res)=>{
    try{
        let { id } = req.body
        let bill = await Bill.findOne({_id:id})
        if (bill){
            let insertBill = {
                name: bill.name
            }
            return res.send({message: `The ${bill.name} found`, insertBill})
        }
        return res.status(404).send({message: 'Invalid Name'})
    }catch(error){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}
export const listBills = async (req, res) => {
    try {
        
        const bills = await Bill.find({ user: req.user.uid })
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'items.product', 
                select: 'nameProduct price stock' 
            });

       
        if (!bills || bills.length === 0) {
            return res.status(404).send({ message: 'No invoices found' });
        }

  
        return res.send({ message: 'Invoices found', invoices: bills });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error retrieving Bill' });
    }
};


export const buy = async (req, res) => {
    try {
        const { uid } = req.user;

      
        let cart = await shoppingCart.findOne({ user: uid });

  
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ message: 'The shopping cart is empty' });
        }

    
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product || item.quantity > product.stock) {
                return res.status(400).send({ message: `Not enough stock for product ${item.product}` });
            }
        }

     
        const billItems = [];
        let totalAmount = 0; 
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            product.sale += item.quantity; 
            await product.save();
            billItems.push({ product: item.product, quantity: item.quantity });

      
            const productPrice = product.price; 
            const productQuantity = item.quantity;
            totalAmount += productPrice * productQuantity;
        }


        const bill = new Bill({
            user: uid,
            items: billItems,
            total: totalAmount

        });
        await bill.save();


        cart.items = [];
        await cart.save();

        return res.send({ message: 'Purchase completed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error processing purchase' });
    }
};
