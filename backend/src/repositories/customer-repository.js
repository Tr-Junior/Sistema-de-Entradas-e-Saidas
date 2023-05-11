const res = require('express/lib/response');
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');


exports.get = async () => {
    const res = await Customer
        .find({}
        );
    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data)
    await customer.save();
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({
        name: data.name,
        password: data.password
    });
    return res;
}
exports.getById = async (id) => {
    const res = await Customer.findById(id);
    return res;
}




