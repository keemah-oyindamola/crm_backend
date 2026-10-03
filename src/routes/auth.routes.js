const express = require("express");
const router = express.Router();
const { register, login, refreshToken } = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});
module.exports = router;