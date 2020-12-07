const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');

//LOGIN ROUTE
//Works in tandem with User.authenticate method
//If cred is valid, will use user object returned from Auth method to make JWT and send to user
router.post("/login", async function(req, res, next) {
  try {
    const {username, password} = req.body; //destructures props from req body
    const user = await User.authenticate(username, password);//User method
    let payload = {username: user.username, is_admin: user.is_admin};//creates payload
    const token = await jwt.sign(payload, SECRET_KEY);//signs it
    return res.json({ token });//returns Token to user
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
