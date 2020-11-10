const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");

function auth(req, res, next) {
    try {
        const reqToken = req.body._token;
        let token = jwt.verify(reqToken, SECRET_KEY);
        res.locals.username = token.username;
        return next();
    } catch (error) {
        throw new ExpressError("Invalid credentials", 401);
    }
}

module.exports = {auth};