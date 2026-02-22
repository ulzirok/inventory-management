const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/role');
const controller = require('../controllers/likes.controller')

router.use(passport.authenticate('jwt', { session: false }), isAuthenticated);
router.post('/items/:id', controller.like);

module.exports = router;