const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/inventory.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/search', controller.search);
router.get('/latest', controller.getLatest);
router.get('/top', controller.getTop);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
