const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../middleware/role");
const controller = require("../controllers/inventory.controller");
const imagekit = require('../middleware/imagekit');

router.get("/latest", controller.getLatest);
router.get("/top", controller.getTop);
router.get("/", controller.getAll);

router.get("/my", passport.authenticate("jwt", { session: false }), isAuthenticated, controller.getMy);
router.get("/:id", controller.getById);

router.use(passport.authenticate("jwt", { session: false }), isAuthenticated);


router.post("/", imagekit.single('image'), controller.create);
router.patch("/:id", imagekit.single('image'), controller.update);
router.post("/delete", controller.delete);

module.exports = router;
