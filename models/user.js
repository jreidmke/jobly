const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class User {
    //REGISTER METHOD
    //Works in tandem with `/user` post route to create new user.
    //adds new user
    //valid JSON body returns user object.
    //requires {username, password, first_name, last_name, email, photo_url} in JSON body
    //is_admin prop defaults to false

    static async register({username, password, first_name, last_name, email, photo_url, is_admin=false}) {

        const duplicateCheck = await db.query( //checks to make sure if username property is unique.
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username]
        );
        if(duplicateCheck.rows[0]) {
            throw new ExpressError(`Username already in use! Please select unique username.`, 400);
        }


        let hashword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR); //use bcrypt has method to create hashed password to save to user table.
        const resp = await db.query(
            `INSERT INTO users
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING username, first_name, last_name, email, is_admin`,
            [username, hashword, first_name, last_name, email, photo_url, is_admin]
        );
        return resp.rows[0];
    }

    //AUTHENTICATE METHOD
    //Works in tandem with `/` post route
    //
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
            `SELECT username, first_name, last_name, email
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
        if(resp.rows.length === 0) {
            throw new ExpressError('Invalid username', 404);
        }
        return resp.rows[0];
    }

    static async remove(username) {
        const usernameCheck = await db.query(
            `SELECT *
            FROM users
            WHERE username=$1`,
            [username]
        );
        if(usernameCheck.rows.length === 0) {
            throw new ExpressError('Invalid username', 404);
        }

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