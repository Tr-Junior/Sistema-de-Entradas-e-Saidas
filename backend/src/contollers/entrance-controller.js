
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/entrance-repository')
const guid = require('guid');
const authService = require('../services/auth-service');



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
// exports.post = async (req, res, next) => {
//     try {

//         // const token = req.body.token || req.query.token || req.headers['x-access-token'];

//         // const data = await authService.decodeToken(token);

//         await repository.create({

//         });

//         res.status(201).send({
//             message: 'pedido adicionado adicionado'
//         });
//     } catch (e) {
//         res.status(500).send({
//             message: 'falha ao processar a requisição'
//         });
//     }
// };