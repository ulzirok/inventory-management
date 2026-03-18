const express = require("express");
const router = express.Router();
const controller = require("../controllers/salesforce.controller");
const passport = require("passport");
const { isAuthenticated } = require("../middleware/role");

router.post("/", passport.authenticate("jwt", { session: false }), isAuthenticated, controller.syncToSalesforce);

module.exports = router;