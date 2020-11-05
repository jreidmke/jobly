//import my stuffs
const express = require('express');
const router = express.Router();

const ExpressError = require('../helpers/expressError');

//ok psuedo code!

router.get('/', async(req, res, next) => {
    //i think the best way to handle this is to use some helper functions. NO!!!! WRONG!!!!!

    //WE WILL MAKE THIS STATIC CLASS METHODS!!! IN THE COMPANY OBJECT!!!

    //OK, that don't seem too bad.

    //
})

//IN THIS ROUTE, MAKE SURE TO INCLUDE JSON VALIDATION FROM JSONSCH3MA
router.post('/', async(req, res, next) => {
    // create a new company

    //return json of {company: {handle:, name:, etc...}}
})

router.get('/:handle', async(req, res, next) => {
    //return one company via handle

    //return json of {company: {handle:, name:, etc...}}
})

//IN THIS ROUTE, MAKE SURE TO INCLUDE JSON VALIDATION FROM JSONSCH3MA
router.patch('/:handle', async(req, res, next) => {
    //update that thing

    //return json of {company: {handle:, name:, etc...}}
})

router.delete('/:handle', async(req, res, next) => {
    //return {message: "Company deleted"}
})
