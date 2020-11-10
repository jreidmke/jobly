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

router.get('/:id', async(req, res, next) => {
    try {
        return res.json(await Job.get(req.params.id));
    } catch (error) {
        return next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        return res.json(await Job.createJob(req.body));
    } catch (error) {
        return next(error);
    }
})

router.patch('/:id', async function(req, res, next) {
    try {
      if ('id' in req.body) {
        throw new ExpressError('You are not allowed to change the ID', 400);
      }

      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

router.delete('/:id', async(req, res, next) => {
    try {
        await Job.remove(req.params.id);
        return res.json({message: "Deleted"});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;