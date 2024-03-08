import { Schema, model} from "mongoose";

const billSchema = Schema({
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
    }],
    total: {
        type: Number,
        required: true
    }
});


export default model('bill', billSchema)