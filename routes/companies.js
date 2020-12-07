const express = require('express');
const router = express.Router();
const ExpressError = require('../helpers/expressError');
const Company = require('../models/company');
const { validate } = require('jsonschema');
const newCompany = require('../schema/newCompany.json');
const updateCompany = require('../schema/updateCompany.json');
const {auth, admin} = require('../middleware/auth');

//Works in tandem with 4 Company methods (Company.search, Company.min_employees, Company.max_employees and Company.min_max_employees)
//Returns a list of companies that meet these conditionals
//Uses auth middleware to ensure user is logged in and has JWT.
router.get('/', auth, async(req, res, next) => {
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

//Works in tandem with Company.get method to return specified comanpy
//Uses auth middleware to ensure user is logged in and has JWT.
//If valid, returns company object with job list.
//Otherwise, returns error
router.get('/:handle', auth, async(req, res, next) => {
    try {
        const resp = await Company.get(req.params.handle);
        return res.json({company: resp});
    } catch (error) {
        return next(error);
    }
})

//Works in tandem with Compnany.create method to create company data.
//Uses admin auth method to ensure user has admin abilities
//If valid returns company data
//Else throws error

router.post('/', admin, async(req, res, next) => {
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

//Works in tandem with Company.update method to update company data.
//Uses admin auth method to ensure user has admin abilities
//If valid returns updated JSON
//Else throws error
router.patch('/:handle', admin, async(req, res, next) => {
    try {
        if ('handle' in req.body) {
          throw new ExpressError('You are not allowed to change the handle.', 400);
        }
        const validation = validate(req.body, updateCompany);
        if(!validation.valid) {
            throw new ExpressError(validation.errors.map(error => error.stack), 400);
        }
        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
      } catch (err) {
        return next(err);
      }
})

//Works in tandem with Company.remove method to delete company
//Uses admin auth method to ensure user has admin abilities
//If valid returns updated JSON
//Else throws error
router.delete('/:handle', admin, async(req, res, next) => {
    await Company.remove(req.params.handle);
    return res.json({message: "Company deleted"});
})

module.exports = router;