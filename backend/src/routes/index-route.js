'use strict';

const express = require ('express');
const router = express.Router();

router.get('/', (_req, res, next) => {
    res.status(200).send({
        titel: "node store API",
        version: "0.0.2"
    });
});



module.exports = router;







