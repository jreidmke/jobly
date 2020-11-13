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

function user(req, res, next) {
    try {
        const reqToken = req.body._token;
        let token = jwt.verify(reqToken, SECRET_KEY);
        res.locals.username = token.username;
        if (token.username === req.params.username) {
            return next();
        }
        throw new ExpressError("Only user can change or delete profile.", 401);
    } catch (error) {
        throw new ExpressError("Only user can change or delete profile.", 401);
    }
}

function admin(req, res, next) {
    try {
        const reqToken = req.body._token;
        let token = jwt.verify(reqToken, SECRET_KEY);
        res.locals.username = token.username;
        if(token.is_admin) {
            return next()
        }
        throw new ExpressError("Only admin can use this functionality", 401);
    } catch (error) {
        throw new ExpressError("Only admin can use this functionality", 401);
    }
}

module.exports = {auth, user, admin};