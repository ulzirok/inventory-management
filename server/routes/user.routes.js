const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAdmin } = require('../middleware/role');
const controller = require('../controllers/user.controller')

router.use(passport.authenticate('jwt', { session: false }), isAdmin);

router.get('/', controller.getAll);
router.get('/:id', controller.getUserById);
router.patch('/:id', controller.changeStatus); 
router.patch('/:id', controller.changeRole); 
router.delete('/:id', controller.delete);

module.exports = router;