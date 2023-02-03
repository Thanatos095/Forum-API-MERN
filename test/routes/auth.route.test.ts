import { setup }  from "../setup";
import { Error } from "../../src/Errors";
import { auth } from "../api_utility";
describe("/auth", () => {
    setup();
    describe("POST /register", () => {
        describe("Given that username is taken", () => {
            it("should return 400, and an error code.", async () => {
                const response = await auth.register({
                    username : 'user1',
                    password : 'password',
                    first_name : 'John',
                    last_name : 'Doe',
                    email : 'user1@example.com',
                    dob : '1995-01-01'
                });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_USERNAME_ALREADY_EXISTS });
            });
        });
    });
    describe("Given that email is taken", () => {
        it("should return 400, and an error code.", async () => {
            const response = await auth.register({
                username : 'fasfasf',
                password : 'password',
                first_name : 'John',
                last_name : 'Doe',
                email : 'user1@example.com',
                dob : '1995-01-01'
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error_code: Error.AUTH_EMAIL_ALREADY_EXISTS });
        });
    });
    describe("Given that username and email are not taken", () => {
        it("should return 200, user's info and api token.", async () => {
            const response = await auth.register({
                username : 'mahad',
                password : 'password',
                first_name : 'mahad',
                last_name : 'hameed',
                email : 'mahad.hameed@forum.com',
                dob : '2002-10-16'
            });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                data: {
                    username: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    dob: expect.any(String),
                    createdAt: expect.any(String)
                },
                token: expect.any(String)
            });
        });
    });
    describe("Given that some required fields are missing from body.", () => {
        it("Should return a 400.", async () => {;
            /* We have to manually send the request to the request to test invalid request parameters. */
            Object.entries({
                username: 'mahad',
                password: 'password',
                first_name: 'mahad',
                last_name: 'hameed',
                email: 'mahad.hameed@forum.com',
                dob: '2002-10-16'
            }).map(async ([key, value]) => {
                const response = await auth.register({ [key] : value });
                expect(response.status).toBe(400);
            });
        });
    });

    describe("POST /Login", () => {
        describe("Given that username does not exist", () => {
            it("should return a 400, and an error code", async () => {
                const response = await auth.login({
                    username : 'Weirdo',
                    password : '24124'
                });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_INVALID_EMAIL_PASSWORD });
            });
        });

        describe("Given that password is incorrect.", () => {
            it("should return a 400, and an error code", async () => {
                const response = await auth.login({
                    username : 'user1',
                    password : '24124'
                });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_INVALID_EMAIL_PASSWORD });
            });
        });

        describe("Given that login is succesful", () => {
            it("should return a 200, user's info and api key.", async () => {
                const response = await auth.login({
                    username : 'user1',
                    password : 'pass1'
                });
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject({
                    data: {
                        username: expect.any(String),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        email: expect.any(String),
                        dob: expect.any(String),
                        createdAt: expect.any(String)
                    },
                    token: expect.any(String)
                });
            });
        });

        describe("Given that the request body is invalid", () => {
            /* We have to manually send the request to the request to test invalid request parameters. */
            it("should return a 400.", async () => {
                Object.entries({
                    username: 'user1',
                    password: 'pass1',
                }).map(async ([key, value]) => {
                    const res = await auth.login({ [key]: value });
                    expect(res.status).toBe(400);
                });
            });
        })
    });
});