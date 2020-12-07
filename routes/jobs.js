const express = require('express');
const ExpressError = require('../helpers/ExpressError');
const Job = require('../models/Job');
const { validate } = require('jsonschema');
const newJob = require('../schema/newJob.json');
const updateJob = require('../schema/updateJob.json');
const {auth, admin} = require('../middleware/auth');
const router = express.Router();

//Works in tandem with 4 Job methods (Job.search, Job.min_employees, Job.max_employees and Job.min_max_employees)
//Returns a list of jobs that meet these conditionals
//Uses auth middleware to ensure user is logged in and has JWT.

router.get('/', auth, async(req, res, next) => {
    try {
        if('search' in req.query) {
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

//Works in tandem with Job.get method to return specified job
//Uses auth middleware to ensure user is logged in and has JWT.
//If valid, returns job object.
//Otherwise, returns error
router.get('/:id', auth, async(req, res, next) => {
    try {
        return res.json(await Job.get(req.params.id));
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with Job.create method to create job data.
//Uses admin auth method to ensure user has admin abilities
//If valid returns job data
//Else throws error
router.post('/', admin, async(req, res, next) => {
    try {
        const validation = validate(req.body, newJob);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        return res.json(await Job.createJob(req.body));
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with Job.update method to update job data.
//Uses admin auth method to ensure user has admin abilities
//If valid returns updated JSON
//Else throws error
router.patch('/:id', admin, async function(req, res, next) {
    try {
      if ('id' in req.body) {
        throw new ExpressError('You are not allowed to change the ID', 400);
      }
      const validation = validate(req.body, updateJob);
      if(!validation.valid) {
          throw new ExpressError(validation.errors.map(error => error.stack), 400);
      }
      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

//Works in tandem with Job.remove method to delete job
//Uses admin auth method to ensure user has admin abilities
//If valid returns updated JSON
//Else throws error
router.delete('/:id', admin, async(req, res, next) => {
    try {
        await Job.remove(req.params.id);
        return res.json({message: "Deleted"});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;