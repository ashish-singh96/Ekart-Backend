import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    image: {
        public_id: String,
        url: String
    },
    otherImages: [{
        public_id: String,
        url: String
    }],
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const product = mongoose.model('Product', ProductSchema);
export default product;
