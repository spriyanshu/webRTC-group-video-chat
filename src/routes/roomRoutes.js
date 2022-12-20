const express = require("express");
const { create, signIn } = require("../controller/roomControllers");
const router = express.Router();
const isAuthanticated = require("../middlewares/isAuthanticated");
// router.use(isAuthanticated);

router.route("/create").get(create);

module.exports = router;
