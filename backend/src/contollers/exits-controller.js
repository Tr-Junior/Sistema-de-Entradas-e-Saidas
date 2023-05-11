'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/exits-repository');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');



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


exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.description, 3, 'O título deve ser pelo menos 3 caracteres');
    // contract.hasMinLen(req.body.slug, 3, 'O slug deve ser pelo menos 3 caracteres');
    // contract.hasMinLen(req.body.description, 3, 'A description deve ser pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create({
            description: req.body.description,
            value: req.body.value,
            date: req.body.date
        });
        res.status(201).send({
            message: 'Saída cadastrada com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ message: 'Saída atualizada!' });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Saía Removida!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}