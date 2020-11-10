const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class User {
    static async register({username, password, first_name, last_name, email, photo_url, is_admin=false}) {

        const pkCheck = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username]
        );
        if(pkCheck.rows[0]) {
            throw new ExpressError(`Username already in use! Please select unique username.`, 400);
        }


        let hashword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const resp = await db.query(
            `INSERT INTO users
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING username, first_name, last_name, email`,
            [username, hashword, first_name, last_name, email, photo_url, is_admin]
        );
        return resp.rows[0];
    }

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT password
            FROM users
            WHERE username=$1`,
            [username]
        );
        let user = result.rows[0];

        if(await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new ExpressError('Invalid credentials!', 401);
    }

    static async all() {
        const resp = await db.query(
            `SELCT username, first_name, last_name, email
            FROM users`
        );
        return resp.rows;
    }

    static async get(username) {
        const resp = await db.query(
            `SELECT username, first_name, last_name, email, photo_url
            FROM users
            WHERE username=$1`,
            [username]
        );
        return resp.rows[0];
    }

    static async remove(username) {
        await db.query(
            `DELETE FROM users
            WHERE username=$1`,
            [username]
        );
    }

    static async update(username, data) {
        if (data.password) {
          data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        let { query, values } = sqlForPartialUpdate("users", data, "username", username);

        const result = await db.query(query, values);
        const user = result.rows[0];

        if (!user) {
          throw new ExpressError(`There exists no user '${username}'`, 404);
        }

        delete user.password;
        delete user.is_admin;

        return result.rows[0];
      }

}

module.exports = User;
/*


        static async update() {
            UPDATE blah blah blah
            return {user: {username, first_name, last_name, email, photo_url}}
        }

        static async remove() {
            DELETE FROM users WHERE username=BLAH;
            return {message: "User deleted"}
        }
    }

*/