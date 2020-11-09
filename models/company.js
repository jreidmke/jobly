//import db maybe some other stuff

class Company {


    //async static search{

        //SELECT handle, name FROM companies WHERE name LIKE "%{name}%";}

        /*
        async static min_employees {
            SELECT c.handles, j.titles
            FROM companies AS c
            JOIN jobs AS j
            ON c.handle=j.company_handle
            WHERE c.min_employees > {WHATEVER IS PASSED IN QUERY STRING}
        }
    */

    /*
        async static max_employees {
            SELECT c.handles, j.titles
            FROM companies AS c
            JOIN jobs AS j
            ON c.handle=j.company_handle
            WHERE c.min_employees < {WHATEVER IS PASSED IN QUERY STRING}
        }
    */

    /*
        async static all() {

        }
    */

    /*
        async static get() {
            //returns one
            return {company: {...companyData, jobs: [job, ...]}}
        }
    */

    /*
        async static create() {
            //INSERT INTO companies...
        }

        async static remove() {
            //DELETE FROM companies WHERE name=blah
        }
    */


}