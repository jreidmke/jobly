process.env.NODE_ENV = "test";// this will set DB_URI to list-test

const request = require("supertest");//import supertest to make requests to server
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');
const app = require("../app");
const db = require("../db");

let user;

beforeEach(async() => {
    let data = {
        "username": "jim",
        "password": "pizza",
        "first_name": "James",
        "last_name": "Reid",
        "email": "jreidmke@gmail.com",
        "photo_url": "google.com",
        "is_admin": true
    }
    const hashword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    data.password=hashword;
    const resp = await request(app).post(`/users`).send(data);
    user = data;
})

afterEach(async() => {
    await db.query(`DELETE FROM users`);
})

afterAll(async() => {
    await db.end();
})