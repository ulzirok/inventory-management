const express = require("express");
const router = express.Router();
const controller = require("../controllers/power-automate.controller");

router.post("/ticket", controller.createTicket);

module.exports = router;