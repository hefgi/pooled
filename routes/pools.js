const express = require('express');
const poolController = require('../controllers/poolController');

const router = express.Router();

/* GET all pools. */
router.get('/', poolController.poolList);

/* GET new pool form. */
router.get('/new', poolController.poolCreate);

/* GET new pool form. */
router.get('/newTx', poolController.poolCreateTx);

/* GET pool details. */
router.get('/:id', poolController.poolDetail);

module.exports = router;
