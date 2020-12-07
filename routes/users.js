const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');
const User = require('../models/user');
const {validate} = require('jsonschema');
const newUser = require('../schema/newUser.json');
const updateUser = require('../schema/updateUser.json');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const {user} = require('../middleware/auth');

//Works in tandem with User.all method to return list of ALL USERS
//will return all public data (username, first_name, last_name, email)
router.get('/', async(req, res, next) => {
    try {
        return res.json(await User.all());
    } catch (error) {
        return next(error);
    }
})

//Work in tandem with User.get method to return SINGLE USER
//will return all public data (username, first_name, last_name, email)
router.get('/:username', async(req, res, next) => {
    try {
        return res.json(await User.get(req.params.username));
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with User.register method.
//If all data valid and username unique, will return JWT
//Else, will return error message.
router.post('/', async(req, res, next) => {
    try {
        const validation = validate(req.body, newUser);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        const user = await User.register(req.body);
        let payload = {username: user.username, is_admin: user.is_admin};
        const token = jwt.sign(payload, SECRET_KEY);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with User.update method to UPDATE USER DATA
//uses `user` middleware to check if user is who they claim to be
//If user is who they claim to be, will update data and return new user data
//Else throw error
router.patch('/:username', user, async(req, res, next) => {
    try {
        const validation = validate(req.body, updateUser);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        return res.json(await User.update(req.params.username, req.body));
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with User.remove method to DELETE USER
//uses `user` middleware to check if user is who they claim to be
//If user is who they claim to be, will delete data and return message user deleted
//Else throw error
router.delete('/:username', user, async(req, res, next) => {
    try {
        await User.remove(req.params.username);
        return res.json({message: 'User deleted'});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;