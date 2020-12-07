//import db maybe some other stuff
const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Job {

  //CREATE METHOD
  //Works in tandem with `/jobs` post route to CREATE NEW JOB
  //Valid data will return job object
  //Else error is thrown
    static async createJob(data) {
        const resp = await db.query(
            `INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES($1, $2, $3, $4)
            RETURNING title, salary, equity, company_handle, date_posted`,
            [data.title, data.salary, data.equity, data.company_handle]
        );
        return resp.rows;

    }

    //SEARCH METHOD
    //used in tandem with `/jobs` get route to return list of all jobs
    //as long as they are `LIKE` (sql Like) the search term passed in from query string
    //if passes auth method, returns a list of jobs that match this term
    static async search(term) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE title LIKE $1`,
            [term]
        );
        return resp.rows;
    }

    //MIN_SALARY METHOD
    //used in tandem with `/jobs` get route to return list of all jobs
    //as long as they provide more $$$$$ than number passed in from query string
    //if passes auth method, returns a list of jobs that meet this conditional
    static async min_salary(min) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE salary>$1`,
            [min]
        );
        return resp.rows;
    }

    //MIN_EQUITY METHOD
    //used in tandem with `/jobs` get route to return list of all jobs
    //as long as they provide more equity than number passed in from query string
    //if passes auth method, returns a list of jobs that meet this conditional
    static async min_equity(min) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE equity>$1`,
            [min]
        );
        return resp.rows;
    }

   //GET METHOD
   //Works in tandem with `/jobs/id` get route to return JOB DATA
   //If valid, returns job object.
   //Otherwise, returns error
    static async get(id) {
        const resp = await db.query(
            `SELECT *
            FROM jobs
            WHERE id=$1`,
            [id]
        );
        return resp.rows;
    }

    //UPDATE METHOD
    //works in tandem with `/jobs/id` patch route to UPDATE JOB DATA
    //If user inputs valid creds, will update specified JOB DATA.
    //Else will throw an error
   static async update(id, data) {
        let { query, values } = sqlForPartialUpdate("jobs", data, "id", id);

        const result = await db.query(query, values);
        const job = result.rows[0];

        if (!job) {
        throw new ExpressError(`There exists no job '${id}`, 404);
        }

        return job;
  }

    //REMOVE METHOD
    //Works in tandem with `/jobs/id` delete route to DELETE JOB
    //Valid data will return job deleted message
    //Else error is thrown
    static async remove(id) {
        await db.query(
            `DELETE FROM jobs
            WHERE id=$1`,
            [id]
        );
    }

}

module.exports=Job;