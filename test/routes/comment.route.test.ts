import { auth, comment } from '../api_utility';
import {loadDB, deleteDB } from '../setup';
import { Error } from '../../src/Errors';
import { shutdown } from '../../src/app';
describe('/Comment', () => {
    let user: any;
    let postId = '63c699c7e146e1d8a6fe4198';
    let commentId = '63d64fc59dcbf6b709a147c2';
    let comment2Id = '63d64fc59dcbf6b709a147c4';

    beforeEach( async () => {
        await loadDB();
        let response1 = await auth.login({ username: 'user1', password: 'pass1' });
        user = response1.body;
    });
    afterEach(async () => {
        await deleteDB();
    });
    afterAll(async () => {
        await shutdown();
    });

    describe('POST /add', () => {
        describe('Given that token is not provided.', () => {
            it("should return 400, and an error code", async () => {
                const response = await comment.addComment({ postId: postId, body: 'Nice post!' });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });

        describe('Given that token is provided.', () => {
            describe('Given that the body is correct.', () => {
                it("should return a 200, and the comment's info.", async () => {
                    const response = await comment.addComment({ token: user.token, postId, body: 'Nice post!' });
                    expect(response.status).toBe(200);
                    expect(response.body).toMatchObject({
                        data: {
                            id: expect.any(String),
                            postId,
                            body: 'Nice post!',
                            author: user.data.username
                        }
                    });
                });
            });
            describe('Given that the body is incorrect.', () => {
                it("should return a 400.", async () => {
                    Object.entries({ postId: postId, body: "Nice post" })
                        .map(async ([key, value]) => {
                            const response = await comment.addComment({
                                token: user.token,
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
                const response = await comment.deleteComment({ id: commentId });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });
        describe('Given that token is provided.', () => {
            describe("Given that the token belongs to another user.", () => {
                it("should return a 400, and an error code.", async () => {
                    const response = await comment.deleteComment({ token: user.token, id: comment2Id });
                    expect(response.status).toBe(400);
                    expect(response.body).toEqual({ error_code: Error.COMMENT_UNAUTHORIZED_MODIFICATION });
                });
            });
            describe("Given that the token belongs to the comment's author.", () => {
                it("should return a 200, and the comment's info.", async () => {
                    const response = await comment.deleteComment({ token: user.token, id: commentId });
                    expect(response.status).toBe(200);
                });
            });
        });
    });
    describe('PUT /edit', () => {
        let update = 'I edit :3 post!';
        describe('Given that token is not provided.', () => {
            it("should return 400, and an error code", async () => {
                const response = await comment.editComment({ id: commentId, body: update });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error_code: Error.AUTH_UNAUTHORIZED });
            });
        });

        describe('Given that token is provided.', () => {
            describe('Given that the body is correct.', () => {
                it("should return a 200, and the comment's updated info.", async () => {
                    const response = await comment.editComment({ token: user.token, id: commentId, body: update });
                    expect(response.status).toBe(200);
                    expect(response.body).toMatchObject({
                        data: {
                            id: expect.any(String),
                            postId: expect.any(String),
                            body: update,
                            author: user.data.username
                        }
                    });
                });
            });
            describe('Given that the body is incorrect.', () => {
                it("should return a 400.", async () => {
                    const response = await comment.editComment({ token: user.token, id: commentId });
                    expect(response.status).toBe(400);
                });
            });
        });
    });

    describe('GET /get', () => {
        describe('Given documents are to be sorted by time(ASC)', () => {
            it("should return 200, and the documents", async () => {
                const response = await comment.getComments({postId, paginationFilter: { order: { order: 'ASC', by: 'createdAt' } }});
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(response.body.data.sort((a : any, b : any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
            });
        });
        describe('Given that at most 10 documents are to be fetched', () => {
            it("should return 200, and the documents", async () => {
                const num = 10;
                const response = await comment.getComments({postId, paginationFilter: { limit : num } });
                expect(response.status).toBe(200);
                expect(response.body.data.length <= num).toBe(true);
            });
        });
        // describe('Given that pagination works correctly', () => {
        //     let num_pieces = 2;
        //     let piece_size = 2;
        //     it(`the request for ${num_pieces * piece_size} documents, and request for ${num_pieces} * ${piece_size} should yield same results.`, async () => {
        //         const full = await comment.getComments({postId, paginationFilter: { order: { order: 'ASC', by: 'createdAt' }, limit : num_pieces * piece_size}});
        //         let pieces : any[] = [];
        //         for(let i = 0 ; i < num_pieces ; i++){
        //             pieces.push(await comment.getComments({postId, paginationFilter: { order: { order: 'ASC', by: 'createdAt' }, limit : piece_size, skip : i * piece_size}}));
        //             expect(pieces[i].status).toBe(200);
        //             console.log(i, pieces[i].body.data);
        //             expect(pieces[i].body.data.length <= piece_size).toBe(true);
        //             if(pieces[i].length < piece_size) break;
        //         }
        //         console.log(full.body.data);
        //         console.log(pieces.map(piece => piece.body.data).flat());
        //         expect(full.body.data).toEqual(pieces.map(piece => piece.body.data).flat())
        //     });
        // });
        describe('Given that request body is wrong', () => {
            it("should return 400.", async () => {
                const response = await comment.getComments({paginationFilter : {limit : 10}});
                expect(response.status).toBe(404);
            });            
        });
    });
});
