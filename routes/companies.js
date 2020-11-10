const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');
const Company = require('../models/company');
const { validate } = require('jsonschema');
// const {  } = require('../schema');
const { newCompany, updateCompany } = require('../schema');


router.get('/', async(req, res, next) => {
    try {
        if('search' in req.query) {
            return res.json(await Company.search(req.query.search));
        }
        else if('min_employees' in req.query && 'max_employees' in req.query) {
            return res.json(await Company.min_max_employees(req.query.min_employees, req.query.max_employees));
        }
        else if('min_employees' in req.query) {
            return res.json(await Company.min_employees(req.query.min_employees));
        }
        else if('max_employees' in req.query) {
            return res.json(await Company.max_employees(req.query.max_employees));
        }
        return res.json({message: 'Cannot show all companies. Please search by name or number of employees.'});
    } catch (error) {
        return next(error);
    }

})

router.post('/', async(req, res, next) => {
   try {
        const validation = validate(req.body, newCompany);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        const company = await Company.create(req.body);
        return res.status(201).json({company});
   } catch (error) {
        return next(error);
   }
})

router.get('/:handle', async(req, res, next) => {
    //return one company via handle
    //Company.get()
    const resp = await Company.get(req.params.handle);
    return res.json({company: resp});

    //return json of {company: {handle:, name:, etc...}}
})

//IN THIS ROUTE, MAKE SURE TO INCLUDE JSON VALIDATION FROM JSONSCH3MA
router.patch('/:handle', async(req, res, next) => {
    try {
        if ('handle' in req.body) {
          throw new ExpressError('You are not allowed to change the handle.', 400);
        }

        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
      } catch (err) {
        return next(err);
      }
    //company.update
    //return json of {company: {handle:, name:, etc...}}
})

router.delete('/:handle', async(req, res, next) => {
    await Company.remove(req.params.handle);
    return res.json({message: "Company deleted"});
    //company.remove()
    //return {message: "Company deleted"}
})

module.exports = router;