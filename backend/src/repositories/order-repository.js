
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async (data) => {
    var res = await Order.find({}, 'number createDate customer sale')
        .populate('customer', 'name')
        .populate('sale');
    return res;
}

exports.create = async (data) => {
    var order = new Order(data)
    await order.save();
}

exports.delete = async (id) => {
    await Order.findByIdAndDelete(id);
}

exports.deleteByCode = async (code) => {
    await Order.findOneAndDelete({ number: code });
}