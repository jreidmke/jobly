const express = require('express');
const ExpressError = require('../helpers/ExpressError');
// const { adminRequired, authRequired } = require('../middleware/auth');
const Job = require('../models/Job');
// const { validate } = require('jsonschema');
// const { jobNewSchema, jobUpdateSchema } = require('../schemas');

const router = express.Router({ mergeParams: true });

module.exports = router;

