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

describe("GET /users", () => {
    test("should return list of all users", async() => {
        const resp = await request(app).get(`/users`);
        console.log(user);
        expect(resp.statusCode).toBe(200);
        expect(resp.body[0].username).toBe(user.username);
        expect(resp.body[0].email).toBe(user.email);
    })
})

describe("GET /users/:id", () => {
    test("should return single user", async () => {
        const resp = await request(app).get(`/users/${user.username}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.username).toBe(user.username);
        expect(resp.body.email).toBe(user.email);
    })

    test("should return error msg with invalid username", async() => {
        const resp = await request(app).get(`/users/pizza`);
        expect(resp.statusCode).toBe(404);
        expect(resp.body["message"]).toEqual("Invalid username");

    })
})

describe("POST /users", () => {
    test("should add one user to db", async() => {
        const data = {
            "username": "ted",
            "password": "pizza",
            "first_name": "James",
            "last_name": "Reid",
            "email": "ted@gmail.com",
            "photo_url": "google.com",
            "is_admin": true
        };
        const resp = await request(app).post(`/users`).send(data);
        expect(resp.statusCode).toBe(201);
    })
})