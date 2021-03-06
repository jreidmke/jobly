process.env.NODE_ENV = "test";// this will set DB_URI to list-test

const request = require("supertest");//import supertest to make requests to server
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');
const app = require("../app");
const db = require("../db");

let user;
let token;

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
    token = resp.body.token;
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
        expect(resp.body).toEqual(expect.objectContaining({token: expect.any(String)}));

        const getResp = await request(app).get(`/users/${data.username}`);
        expect(getResp.statusCode).toBe(200);
        expect(getResp.body.username).toEqual(data.username);
        expect(getResp.body.email).toEqual(data.email);
    })

    test("should return error with bad json", async() => {
        const data = {
            "blah": "blegh"
        }
        const resp = await request(app).post(`/users`).send(data);
        expect(resp.statusCode).toBe(400);
    })
})

describe("DELETE /users/:username", () => {
    test("should remove one user if user is specified user", async() => {
        const resp = await request(app).delete(`/users/${user.username}`).send({_token: token});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: 'User deleted'});
    })

    test("should not allow user to delete profile other than their own", async() => {
        const data = {
            "username": "ted",
            "password": "pizza",
            "first_name": "James",
            "last_name": "Reid",
            "email": "ted@gmail.com",
            "photo_url": "google.com",
            "is_admin": true
        };
        await request(app).post(`/users`).send(data);
        const resp = await request(app).delete(`/users/${data.username}`).send({_token: token});
        expect(resp.statusCode).toBe(401);
        expect(resp.body.message).toEqual('Only user can change or delete profile.');
    })
})

describe("PATCH /users/:username", () => {
    test("should update selected user's attributes", async() => {
        const resp = await request(app).patch(`/users/${user.username}`).send({_token: token, first_name: "Jimmy"});
        expect(resp.body.first_name).toEqual("Jimmy");
        const getResp = await request(app).get(`/users/${user.username}`);
        expect(getResp.statusCode).toBe(200);
        expect(getResp.body.first_name).toEqual("Jimmy");
        expect(getResp.body.email).toEqual(user.email);
    })

    test("should not allow non-user to edit profile", async() => {
        const resp = await request(app).patch(`/users/pizza`).send({_token: token, first_name: "Jimmy"});
        expect(resp.statusCode).toBe(401);
        expect(resp.body.message).toEqual('Only user can change or delete profile.');
    })
})