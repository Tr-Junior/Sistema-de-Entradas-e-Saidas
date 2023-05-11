const res = require('express/lib/response');
const mongoose = require('mongoose');
const Exits = mongoose.model('Exits');

exports.get = async () => {
    const res = await Exits
        .find({});
    return res;
}

exports.getById = async (id) => {
    const res = await Exits
        .findById(id);
    return res;
}

exports.create = async (data) => {
    var exits = new Exits(data)
    await exits.save();
}

exports.update = async (id, data) => {
    await Exits.findByIdAndUpdate(id, {
        $set: {
            description: data.description,
            value: data.value,
            date: data.date
        }
    });
}


exports.delete = async (id) => {
    await Exits.findByIdAndDelete(id);
}