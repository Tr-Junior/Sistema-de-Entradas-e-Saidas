'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/exits-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.get('/getById/:id', controller.getById);
router.post('/', controller.post);
router.put('/update/:id', controller.put);
router.delete('/:id', controller.delete);



module.exports = router;