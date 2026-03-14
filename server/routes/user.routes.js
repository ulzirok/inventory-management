const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAdmin } = require("../middleware/role");
const { isAuthenticated } = require("../middleware/role");
const controller = require("../controllers/user.controller");


router.get("/:id", passport.authenticate("jwt", { session: false }), isAuthenticated, controller.getUserById);
router.use(passport.authenticate("jwt", { session: false }), isAdmin);

router.get("/", controller.getAll);
router.patch("/status", controller.changeStatus);
router.patch("/role", controller.changeRole);
router.post("/delete", controller.delete);

module.exports = router;
