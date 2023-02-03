import { Error } from "../../src/Errors";
import { auth, post } from "../api_utility";
import { setup } from "../setup";
describe('/Post', () => {

    setup();

    describe('POST /add', () => {
        describe('Given that token is not provided.', () => {
            it("should return 400, and an error code", async () => {
                const response = await post.addPost({ title: 'Ohayo gozaimas', body: 'noooosafa' });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });

        describe('Given that token is provided.', () => {
            describe('Given that the body is correct.', () => {
                it("should return a 200, and the post's info.", async () => {
                    const user = await auth.login({ username: 'user1', password: 'pass1' });
                    const response = await post.addPost({ token: user.body.token, title: 'First post', body: 'Hello guys' });
                    expect(response.status).toBe(200);
                    expect(response.body).toMatchObject({
                        data: {
                            id: expect.any(String),
                            title: expect.any(String),
                            body: expect.any(String),
                            author: 'user1'
                        }
                    });
                });
            });
            describe('Given that the body is incorrect.', () => {
                it("should return a 400.", async () => {
                    const user = await auth.login({ username: 'user1', password: 'pass1' });
                    Object.entries({ title: "Ohayo gozaimas", body: "nooosafa." })
                        .map(async ([key, value]) => {
                            const response = await post.addPost({
                                token: user.body.token,
                                [key]: value
                            });
                            expect(response.status).toBe(400);
                        });
                });
            });
        });
    });

    describe('DELETE /delete', () => {
        describe('Given that token is not provided.', () => {
            it("should return 400, and an error code", async () => {
                const response = await post.deletePost({ id: '063c281359fa6b4c3ea2fef79' }); /* user1's post id */
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });
        describe('Given that token is provided.', () => {
            describe("Given that the token belongs to another user.", () => {
                it("should return a 400, and an error code.", async () => {
                    const user = await auth.login({ username: 'user2', password: 'pass2' });
                    const response = await post.deletePost({ token: user.body.token, id: '63c281359fa6b4c3ea2fef79' }); /* User1's post's id*/
                    expect(response.status).toBe(400);
                    expect(response.body).toEqual({ error_code: Error.POST_UNAUTHORIZED_MODIFICATION });
                });
            });
            describe("Given that the token is valid", () => {
                describe('Given that the body is correct.', () => {
                    it("should return a 200, and the post's info", async () => {
                        const user = await auth.login({ username: 'user1', password: 'pass1' });
                        const response = await post.deletePost({ token: user.body.token, id: '63c281359fa6b4c3ea2fef79' });
                        expect(response.status).toBe(200);
                    });
                });
                describe('Given that the id is not given.', () => {
                    it("should return a 404.", async () => {
                        const user = await auth.login({ username: 'user1', password: 'pass1' });
                        const response = await post.deletePost({ token: user.body.token });
                        expect(response.status).toBe(404);
                    });
                });
            });
        });
    });

    describe('PUT /edit', () => {
        describe('Given that token is not provided.', () => {
            it("should return a 400, and an error code.", async () => {
                const response = await post.editPost({ id: '0', title: 'Hello' });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });
        describe('Given that token is provided.', () => {
            describe("Given that the token belongs to another user.", () => {
                it("should return a 400, and an error code.", async () => {
                    const user = await auth.login({ username: 'user2', password: 'pass2' });
                    const response = await post.editPost({ token: user.body.token, id: '63c281359fa6b4c3ea2fef79', body: 'Hello World' });
                    expect(response.status).toBe(400);
                    expect(response.body).toEqual({ error_code: Error.POST_UNAUTHORIZED_MODIFICATION });
                });
            });
            describe("Given that the token is valid", () => {
                describe('Given that the body is correct.', () => {
                    it("should return a 200, and the post's info", async () => {
                        const body = { id: '63c281359fa6b4c3ea2fef79', title: 'Booga', body: 'Hello World' };
                        const user = await auth.login({ username: 'user1', password: 'pass1' });
                        const response = await post.editPost({ token: user.body.token, ...body });
                        expect(response.status).toBe(200);
                        expect(response.body).toMatchObject({
                            data: {
                                ...body,
                                author: 'user1',
                                createdAt : expect.any(String)
                            }
                        });
                    });
                });
                describe('Given that id is not specified.', () => {
                    it("should return a 400", async () => {
                        const user = await auth.login({ username: 'user1', password: 'pass1' });
                        const response = await post.editPost({ token: user.body.token, title: 'Booga', body: 'Hello World' });
                        expect(response.status).toBe(404);
                    });
                });
            });
        });
    });

    describe('GET /search', () => {
        describe('Given documents are to be sorted by time(ASC)', () => {
            it("should return 200, and the documents", async () => {
                const response = await post.searchByTitle({ search: 'Post', paginationFilter: { order: { order: 'ASC', by: 'createdAt' } } });
                if(response.body.data.length === 0) console.warn("No posts for the given query.")
                expect(response.status).toBe(200);
                expect('createdAt' in response.body.data[0]).toBe(true);
                expect(response.body.data).toStrictEqual(response.body.data.sort((a : any, b : any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
            
            });
        });
        describe('Given that at most 10 documents are to be fetched', () => {
            it("should return 200, and the documents", async () => {
                const response = await post.searchByTitle({ search: 'Post', paginationFilter: { limit : 10 } });
                if(response.body.data.length === 0) console.warn("No posts for the given query.")
                expect(response.status).toBe(200);
                expect(response.body.data.length <= 10).toBe(true);
            });
        });
        // describe('Given that pagination works correctly', () => {
        //     let num_pieces = 2;
        //     let piece_size = 2;
        //     it(`the request for ${num_pieces * piece_size} documents, and request for ${num_pieces} * ${piece_size} should yield same results.`, async () => {
        //         const full = await post.searchByTitle({ search: '.*', paginationFilter: { order: { order: 'ASC', by: 'createdAt' }, limit : num_pieces * piece_size}});
        //         if(full.body.data.length === 0) console.warn("No posts for the given query.")
        //         let pieces : any[] = [];
        //         for(let i = 0 ; i < num_pieces ; i++){
        //             pieces.push(await post.searchByTitle({ search: '.*', paginationFilter: { order: { order: 'ASC', by: 'createdAt' }, limit : piece_size, skip : i * piece_size }}));
        //             expect(pieces[i].status).toBe(200);
        //             expect(pieces[i].body.data.length <= piece_size).toBe(true);
        //             if(pieces[i].length < piece_size) break;
        //         }
        //         expect(full.body.data).toEqual(pieces.map(piece => piece.body.data).flat())
        //     });
        // });
        describe('Given that request body is wrong', () => {
            it("should return 400.", async () => {
                const response = await post.searchByTitle({paginationFilter: { order: { order: 'ASC', by: 'createdAt' }, limit : 10, skip : 10 }});
                expect(response.status).toBe(400);
            });            
        });
    });
});