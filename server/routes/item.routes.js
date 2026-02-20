const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/item.controller');

router.get('/:inventoryId', controller.getByInventoryId);

router.use(passport.authenticate('jwt', { session: false }))

router.post('/inventory/:inventoryId', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
