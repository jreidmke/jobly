//import db maybe some other stuff

class Company {


    //async static search{

    //makes a db.query and returns a "filtered list of handles and names"

    //OOOOOOOH WEE, we're gonna have to do some of that weird SQL stuff with words and stuff.

    // So it'll be something like

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
        }
    */

    /*
        async static add() {
            //INSERT INTO companies...
        }

        async static remove() {
            //DELETE FROM companies WHERE name=blah
        }
    */


}