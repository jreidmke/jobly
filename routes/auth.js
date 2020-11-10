const express = require("express");
const router = new express.Router();
const User = require("../models/User");

router.post("/login", async function(req, res, next) {
  try {
    const user = await User.authenticate(req.body);
    
    let payload = {username: user.user, is_admin: user.is_admin};
    const token = jwt.sign(payload, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
