const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

router.get('/search', controller.search);
router.get('/latest', controller.getLatest);
router.get('/top', controller.getTop);

module.exports = router;
