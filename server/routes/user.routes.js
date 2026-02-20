const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller')

router.get('/', controller.getAll);
router.get('/:id', controller.getUserById);
router.patch('/:id', controller.update); // status, role
router.delete('/:id', controller.delete);

module.exports = router;