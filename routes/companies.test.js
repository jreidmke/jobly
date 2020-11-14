process.env.NODE_ENV = "test";// this will set DB_URI to list-test

const request = require("supertest");//import supertest to make requests to server
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');
const app = require("../app");
const db = require("../db");

let user;
let token;
let company;

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
    const userResp = await request(app).post(`/users`).send(data);
    token = resp.body.token;
    user = data;
    let companyData = {
        "handle": "burger",
        "name": "Burger Co.",
        "num_employees": 250,
        "description": "We make the best burgers!",
        "logo_url": "google.com"
    }
    const companyResp = await request(app).post(`/companies`).send(companyData);
    company = companyResp.body.company;
    console.log(company);
});

afterEach(async() => {
    await db.query(`DELETE FROM users`);
    await db.query(`DELETE FROM companies`);

})

afterAll(async() => {
    await db.end();
})

describe("GET /companies/:handle", () => {
    test("returns info on selected company", async() => {
        
    })
})