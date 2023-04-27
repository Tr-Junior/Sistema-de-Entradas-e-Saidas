const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    codigo: {
        type: String,
        required: true,
        trim: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    purchasePrice: {
        type: Number,
        trim: true
    },

    quantity: {
        type: Number,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
    },
});



module.exports = mongoose.model('Product', schema);