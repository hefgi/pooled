const express = require('express');
const poolController = require('../controllers/poolController');

const router = express.Router();

/* GET all polls. */
router.get('/', poolController.poolList);

/* GET all accounts. */
router.get('/getAccounts', poolController.getAccounts);

/* GET new course form. */
router.get('/new', poolController.poolCreateGet);

/* POST new course. */
router.post('/create', poolController.poolCreatePost);

/* GET course details. */
router.get('/:id', poolController.poolDetail);

module.exports = router;
