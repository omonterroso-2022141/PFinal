import { Schema, model} from "mongoose";

const shoppingSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true        
    },
    items: [{
        product: {
            type: Schema.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

export default model('shopping', shoppingSchema)