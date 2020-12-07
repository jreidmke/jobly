//import db maybe some other stuff
const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {
    //SEARCH METHOD
    //used in tandem with `/companies` get route to return list of all companies
    //as long as they are `LIKE` (sql Like) the search term passed in from query string
    //if passes auth method, returns a list of companies that match this term
    static async search(term) {
        const resp = await db.query(
            `SELECT handle, name
            FROM companies
            WHERE handle
            LIKE $1`, [term]
        );
        return resp.rows;
    }

    //MIN_EMPLOYEES METHOD
    //used in tandem with `/companies` get route to return list of all companies
    //as long as they have more employees than number passed in from query string
    //if passes auth method, returns a list of companies that meet this conditional
   static async min_employees(min) {
        const resp = await db.query(`
            SELECT handle, name
            FROM companies
            WHERE num_employees >= $1
            `, [min]);

        return resp.rows;
   }

    //MAX_EMPLOYEES METHOD
    //used in tandem with `/companies` get route to return list of all companies
    //as long as they have fewer employees than number passed in from query string
    //if passes auth method, returns a list of companies that meet this conditional
   static async max_employees(max) {
        const resp = await db.query(`
        SELECT handle, name
        FROM companies
        WHERE num_employees <= $1
        `, [max]);

        return resp.rows;
   }

    //MIN_MAX_EMPLOYEES METHOD
    //used in tandem with `/companies` get route to return list of all companies
    //as long as they have a number of employees that is between the numbers passed in from query string
    //if passes auth method, returns a list of companies that meet this conditional
   static async min_max_employees(min, max) {
       console.log(min);
       console.log(max);
       if(parseInt(min) > parseInt(max)) {
           throw new ExpressError('Min employees cannot be greater than max!', 400);
       }
       const resp = await db.query(
           `SELECT handle, name
           FROM companies
           WHERE num_employees >= $1 AND
           num_employees <= $2`,
           [min, max]
       );
       return resp.rows;
   }

   //GET METHOD
   //Works in tandem with `/companies/handle` get route to RETURN COMPANY DATA
   //If valid, returns company object with job list.
   //Otherwise, returns error
   static async get(handle) {
       const comResp = await db.query(
            `SELECT handle, name, num_employees, description
            FROM companies
            WHERE handle=$1`,
            [handle]
       );
        const company = comResp.rows[0];

        if(!company) {
            throw new ExpressError("Invalid handle", 404);
        }

        const jobsResp = await db.query(
            `SELECT id, title, salary, equity
            FROM jobs
            WHERE company_handle=$1`,
            [handle]
        );

        company.jobs = jobsResp.rows;
        return company;
   }

    //UPDATE METHOD
    //works in tandem with `/companies/handle` patch route to UPDATE COMPANY DATA
    //If user inputs valid creds, will update specified COMPANY data.
    //Else will throw an error
   static async update(handle, data) {
    let { query, values } = sqlForPartialUpdate(
      "companies",
      data,
      "handle",
      handle
    );

    const result = await db.query(query, values);
    const company = result.rows[0];

    if (!company) {
      throw new ExpressError(`There exists no company '${handle}`, 404);
    }

    return company;
  }

  //CREATE METHOD
  //Works in tandem with `/companies` post route to CREATE NEW COMPANY
  //Valid data will return company object
  //Else error is thrown
    static async create(data) {
        const check = await db.query(
            `SELECT handle
            FROM companies
            WHERE handle=$1`,
            [data.handle]
        );
        if(check.rows[0]) {
            throw new ExpressError('Company already exists', 400);
        }

        const result = await db.query(
            `INSERT INTO companies
                    (handle, name, num_employees, description, logo_url)
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING handle, name, num_employees, description, logo_url`,
            [
              data.handle,
              data.name,
              data.num_employees,
              data.description,
              data.logo_url
            ]
          );

          return result.rows[0];
    }

    //REMOVE METHOD
    //Works in tandem with `/companies/handle` delete route to DELETE COMPANY
    //Valid data will return company deleted message
    //Else error is thrown
    static async remove(handle) {
        const result = await db.query(
            `DELETE FROM companies
            WHERE handle=$1
            RETURNING handle`,
            [handle]
        );

        if(result.rows.length === 0) {
            throw new ExpressError(`Invalid hanlde`, 404);
        }
    }
}

module.exports = Company;