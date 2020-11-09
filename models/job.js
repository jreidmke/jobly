//import db maybe some other stuff
const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Job {

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

    static async search(term) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE title LIKE $1`,
            [term]
        );
        return resp.rows;
    }

    static async min_salary(min) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE salary>$1`,
            [min]
        );
        return resp.rows;
    }

    static async min_equity(min) {
        const resp = await db.query(
            `SELECT title, company_handle
            FROM jobs
            WHERE equity>$1`,
            [min]
        );
        return resp.rows;
    }

    static async get(id) {
        const resp = await db.query(
            `SELECT *
            FROM jobs
            WHERE id=$1`,
            [id]
        );
        return resp.rows;
    }

   static async update(id, data) {
        let { query, values } = sqlForPartialUpdate("jobs", data, "id", id);

        const result = await db.query(query, values);
        const job = result.rows[0];

        if (!job) {
        throw new ExpressError(`There exists no job '${id}`, 404);
        }

        return job;
  }

    static async remove(id) {
        await db.query(
            `DELETE FROM jobs
            WHERE id=$1`,
            [id]
        );
    }

}

module.exports=Job;