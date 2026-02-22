const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment.controller')

router.get('/', controller.getByItem);
router.post('/', controller.create);

module.exports = router;