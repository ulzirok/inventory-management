const express = require("express");
const router = express.Router();
const controller = require("../controllers/odoo.controller");

router.get("/external/inventory-stats", controller.getInventoryStats);

module.exports = router;