'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/order-controller');
const authService = require('../services/auth-service');



router.post('/', controller.post);
router.get('/', controller.get);
router.delete('/', controller.delete);




module.exports = router;