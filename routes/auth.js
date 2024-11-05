const router = require("express").Router();
const passport = require("passport");
const authController = require("../controller/authController");

router.post("/login", passport.authenticate("local"), authController.login);
router.post("/logout", authController.logout);
router.get("/user", authController.getUser);

module.exports = router;
