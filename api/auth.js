const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const { createToken, authenticate } = require("../../utils/auth");

const authTokenKey = process.env.AUTH_TOKEN_KEY || "authToken";
router.get("/hi", (req, res, next) => {
  console.log("AB");
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    res.cookie(authTokenKey, token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    const user = await User.signUp(email, password, nickname);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", authenticate, async (req, res, next) => {
  try {
    res.cookie(authTokenKey, "", {
      httpOnly: true,
      maxAge: 0,
    });

    res.status(204).json({
      message: "logout 완료",
    });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

module.exports = router;
