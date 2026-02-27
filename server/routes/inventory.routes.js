const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../middleware/role");
const controller = require("../controllers/inventory.controller");

router.get("/latest", controller.getLatest);
router.get("/top", controller.getTop);

router.use(passport.authenticate("jwt", { session: false }), isAuthenticated);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.post("/delete", controller.delete);

module.exports = router;
