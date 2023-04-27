const express = require("express");
const bodyParser = require('body-parser');
const config = require('./config')
const app = express();
const mongoose = require('mongoose')
const router = express.Router();

mongoose.connect(config.connectionString);

app.use(bodyParser.json(
    { limit: '5mb' }
));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header('Access-Control-Alloe-Origin', '*');
    res.header('Access-Control-Alloe-Origin', 'Origin, X-Requested-with, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Alloe-Origin', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
const Entrance = require('./models/entrance');

const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-routes');
const entranceRoute = require('./routes/entrance-route');


app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);
app.use('/entrance', entranceRoute);

module.exports = app;