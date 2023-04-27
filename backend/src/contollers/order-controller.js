
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/order-repository');
const entrance = require('../repositories/entrance-repository');
const product = require('../repositories/product-repository')
const guid = require('guid');
const authService = require('../services/auth-service');
const Product = require('../models/product');



exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}


exports.post = async (req, res, next) => {
    try {

        // const token = req.body.token || req.query.token || req.headers['x-access-token'];

        // const data = await authService.decodeToken(token);
        //const soma = 0;
        await repository.create({

            //customer: data.name,
            number: guid.raw().substring(0, 6),
            sale: req.body.sale,
            // sale: {
            //     items: req.body.sale.items,
            //     discount: req.body.sale.discount,

            //     total: req.body.sale.items.forEach(async (e) => {
            //         const total = (e.quantity * e.price);

            //         console.log("total = ", soma);
            //     })
            // }
        });

        await entrance.create(
            {
                value: req.body.sale.total
            }
        )

        req.body.sale.items.forEach(async (e) => {
            const products = await product.getById(e.product);
            product.update(products, {
                quantity: products.quantity = products.quantity - e.quantity,
            })
        });



        res.status(201).send({
            message: 'Venda efetuada com sucesso'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};


exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}