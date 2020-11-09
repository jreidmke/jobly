const express = require('express');
const ExpressError = require('../helpers/ExpressError');
// const { adminRequired, authRequired } = require('../middleware/auth');
const Job = require('../models/Job');
// const { validate } = require('jsonschema');
// const { jobNewSchema, jobUpdateSchema } = require('../schemas');

const router = express.Router({ mergeParams: true });

router.get('/', async(req, res, next) => {
    try {
        if('search' in req.query) {
            console.log(req.query);
            return res.json(await Job.search(req.query.search));
        }
        else if('min_salary' in req.query) {
            return res.json(await Job.min_salary(req.query.min_salary));
        }
        else if('min_equity' in req.query) {
            return res.json(await Job.min_equity(req.query.min_equity));
        }
        else {
            return res.json({message: "Please search by title, salary or equity."});
        }
    } catch (error) {
        return next(error)
    }
})

router.post('/', async(req, res, next) => {
    try {
        return res.json(await Job.createJob(req.body));
    } catch (error) {
        return next(error);
    }
})

module.exports = router;