const express = require('express');
const poolController = require('../controllers/poolController');

const router = express.Router();

/* GET all polls. */
router.get('/', poolController.pool_list);

/* GET new course form. */
router.get('/new', poolController.pool_create_get);

/* POST new course. */
router.post('/create', poolController.pool_create_post);

/* GET course details. */
router.get('/:id', poolController.pool_detail);

module.exports = router;
