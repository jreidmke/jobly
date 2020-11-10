//import db maybe some other stuff
const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {
    static async search(term) {
        const resp = await db.query(
            `SELECT handle, name
            FROM companies
            WHERE handle
            LIKE $1`, [term]
        );
        return resp.rows;
    }

   static async min_employees(min) {
        const resp = await db.query(`
            SELECT handle, name
            FROM companies
            WHERE num_employees >= $1
            `, [min]);

        return resp.rows;
   }

   static async max_employees(max) {
        const resp = await db.query(`
        SELECT handle, name
        FROM companies
        WHERE num_employees <= $1
        `, [max]);

        return resp.rows;
   }

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