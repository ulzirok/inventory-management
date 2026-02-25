const express = require("express");
const router = express.Router();
const controller = require("../controllers/search-by-tag.controller");

router.get("/", controller.searchByTag);

module.exports = router;