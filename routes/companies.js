//import my stuffs
const express = require('express');
const router = express.Router();

const ExpressError = require('../helpers/expressError');

//ok psuedo code!

router.get('/', async(req, res, next) => {
    /* This is where you are going to check for query strings

    IF query string is search:
        Company.search()

    If query string is min_employ:
        Company.min_employees

    If query string is max_employ:
        Company.max_employ

    IF min > max:
        Throw a 404
        */

})

//IN THIS ROUTE, MAKE SURE TO INCLUDE JSON VALIDATION FROM JSONSCH3MA
router.post('/', async(req, res, next) => {
    // create a new company
    /*
        Compnay.create()
    */


    //return json of {company: {handle:, name:, etc...}}
})

router.get('/:handle', async(req, res, next) => {
    //return one company via handle
    //Company.get()

    //return json of {company: {handle:, name:, etc...}}
})

//IN THIS ROUTE, MAKE SURE TO INCLUDE JSON VALIDATION FROM JSONSCH3MA
router.patch('/:handle', async(req, res, next) => {

    //company.update
    //return json of {company: {handle:, name:, etc...}}
})

router.delete('/:handle', async(req, res, next) => {

    //company.remove()
    //return {message: "Company deleted"}
})
