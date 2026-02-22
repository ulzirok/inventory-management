const express = require('express');
const router = express.Router();
const controller = require('../controllers/likes.controller')

router.post('/items/:id', controller.like);

module.exports = router;