const express = require("express");
const router = express.Router();
const controller = require("../controllers/tags.controller");

router.get("/", controller.getTopTags);

module.exports = router;