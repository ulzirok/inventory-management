const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../middleware/role");
const controller = require("../controllers/item.controller");

router.get("/public/:inventoryId", controller.getItemsPublic);

router.use(passport.authenticate("jwt", { session: false }), isAuthenticated);

router.get("/:inventoryId", controller.getItems);
router.post("/inventory/:inventoryId", controller.create);
router.get("/item/:id", controller.getItem);
router.patch("/:id", controller.update);
router.post("/delete", controller.delete);

module.exports = router;
