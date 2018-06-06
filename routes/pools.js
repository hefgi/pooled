const express = require('express');
const poolController = require('../controllers/poolController');

const router = express.Router();

/* GET new pool form. */
router.get('/new', poolController.poolCreate);

/* GET new pool form. */
router.get('/newTx', poolController.poolCreateTx);

/* GET new pool form. */
router.get('/newSuccess', poolController.poolCreateSuccess);

/* GET pool details. from owner */
router.get('/:addr/owner', poolController.poolDetailOwner);

/* GET pool details. */
router.get('/:addr', poolController.poolDetail);

/* GET all pools. */
router.get('/', poolController.poolList);

module.exports = router;
