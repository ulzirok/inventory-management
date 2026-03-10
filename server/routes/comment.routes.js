const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../middleware/role");
const controller = require("../controllers/comment.controller");

router.use(passport.authenticate("jwt", { session: false }), isAuthenticated);
router.get("/:inventoryId", controller.getMessages);

module.exports = router;
