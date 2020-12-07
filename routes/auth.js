const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');

router.post("/login", async function(req, res, next) {
  try {
    const {username, password} = req.body;
    const user = await User.authenticate(username, password);
    let payload = {username: user.username, is_admin: user.is_admin};
    const token = await jwt.sign(payload, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
