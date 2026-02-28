const express = require("express");
const router = express.Router();
const controller = require("../controllers/tags.controller");

router.get("/", controller.getTags);

module.exports = router;