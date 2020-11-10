const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');
const User = require('../models/user');
const {validate} = require('jsonschema');
const newUser = require('../schema/newUser.json');
const updateUser = require('../schema/updateUser.json');

router.get('/', async(req, res, next) => {
    try {
        return res.json(await User.all());
    } catch (error) {
        return next(error);
    }
})

router.get('/:username', async(req, res, next) => {
    try {
        return res.json(await User.get(req.params.username));
    } catch (error) {
        return next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const validation = validate(req.body, newUser);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        return res.json(await User.register(req.body));
    } catch (error) {
        return next(error);
    }
})

router.patch('/:username', async(req, res, next) => {
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

router.delete('/:username', async(req, res, next) => {
    try {
        await User.remove(req.params.username);
        return res.json({message: 'User deleted'});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;