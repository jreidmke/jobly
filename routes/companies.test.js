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
    token = userResp.body.token;
    user = data;
    let companyData = {
        "_token": token,
        "handle": "burger",
        "name": "Burger Co.",
        "num_employees": 250,
        "description": "We make the best burgers!",
        "logo_url": "google.com"
    }
    const companyResp = await request(app).post(`/companies`).send(companyData);
    company = companyResp.body.company;
    company._token = token;
});

afterEach(async() => {
    await db.query(`DELETE FROM users`);
    await db.query(`DELETE FROM companies`);

})

afterAll(async() => {
    await db.end();
})

describe("GET /companies", () => {
    test("returns a list of companies via handle search", async() => {
        const resp = await request(app).get(`/companies?search=${company.handle}`).send({_token:token});
        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toEqual({handle: 'burger', name: 'Burger Co.'});
    })

    test("returns a list of companies via min and max employees", async() => {
        const resp = await request(app).get(`/companies?min_employees=200&max_employees=500`).send({_token:token});
        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toEqual({handle: 'burger', name: 'Burger Co.'});
    })

    test("returns 400 error with mathematically impossible min and max", async() => {
        const resp = await request(app).get(`/companies?min_employees=500&max_employees=200`).send({_token:token});
        expect(resp.statusCode).toBe(400);
        expect(resp.body.message).toEqual('Min employees cannot be greater than max!');
    })

    test("returns a list of companies via min employees", async() => {
        const resp = await request(app).get(`/companies?min_employees=200`).send({_token:token});
        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toEqual({handle: 'burger', name: 'Burger Co.'});
    })

    test("returns a list of companies via max employees", async() => {
        const resp = await request(app).get(`/companies?max_employees=500`).send({_token:token});
        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toEqual({handle: 'burger', name: 'Burger Co.'});
    })
})

describe("GET /companies/:handle", () => {
    test("returns info on selected company", async() => {
        const resp = await request(app).get(`/companies/${company.handle}`).send({_token: token})
        expect(resp.statusCode).toBe(200);
        expect(resp.body.company.name).toEqual("Burger Co.");
        expect(resp.body.company.num_employees).toBe(250);
    })
})