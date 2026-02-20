const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth.controller')

router.post('/register', controller.register)
router.post('/login', controller.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), controller.socialCallback);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), controller.socialCallback);

module.exports = router