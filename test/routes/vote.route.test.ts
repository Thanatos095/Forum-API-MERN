import { auth, post, vote } from "../api_utility";
import { setup } from "../setup";
describe('/vote', () => {
    let user: any;
    let postData: any;
    setup();
    beforeAll(async () => {
        let response1 = await auth.register({ username: "MeowTooPa", password: "HelloKitty", first_name: "Hellos", last_name: "Meow", dob: "1995-01-01", email: "mahad@meow231414.com" });
        user = response1.body;
        let response2 = await post.addPost({ token: user.token, title: 'Test Post', body: 'Test Body' });
        postData = response2.body.data;
    });

    describe('make vote', () => {
        it('should return 200 and the vote information', async () => {
            const response = await vote.vote({ token: user.token, votableId: postData.id, value: 1 });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                data: {
                    id: expect.any(String),
                    votableId: postData.id,
                    value: 1,
                    username: user.data.username
                }
            });
        });

        it('should return 400 if the votableId is not provided', async () => {
            const response = await vote.vote({ token: user.token, value: 1 });
            expect(response.status).toBe(404);
        });

        it('should return 400 if the value is not provided', async () => {
            const response = await vote.vote({ token: user.token, votableId: postData.id });
            expect(response.status).toBe(400);
        });
    });

    describe('remove vote', () => {
        it('should return 200 and the vote information', async () => {
            await vote.vote({ token: user.token, votableId: postData.id, value: 1 });
            const response = await vote.removeVote({ token: user.token, votableId: postData.id });
            expect(response.status).toBe(200);
        });

        it('should return 400 if the votableId is not provided', async () => {
            const response = await vote.removeVote({ token: user.token });
            expect(response.status).toBe(404);
        });
    });

    describe('Get votes', () => {
        const username = 'user1';
        const votableId = '63c699c7e146e1d8a6fe4198';
        it("get by username", async () => {
            const response = await vote.getVotes({ username });
            expect(response.status).toBe(200);
            response.body.data.map((vote: any) => {
                expect(vote).toMatchObject({
                    id: expect.any(String),
                    value : expect.any(Number),
                    username,
                    votableId : expect.any(String),
                });
            });
        });
        it("get by votableId", async () => {
            const response = await vote.getVotes({ votableId });
            expect(response.status).toBe(200);
            response.body.data.map((vote: any) => {
                expect(vote).toMatchObject({
                    id: expect.any(String),
                    value : expect.any(Number),
                    username : expect.any(String),
                    votableId,
                });
            });
        });

        it("get by votableId, and username", async () => {
            const response = await vote.getVotes({ votableId, username });
            expect(response.status).toBe(200);
            response.body.data.map((vote: any) => {
                expect(vote).toMatchObject({
                    id: expect.any(String),
                    value : expect.any(Number),
                    username,
                    votableId
                });
            });
        });
    });

    describe('Get votes count.', () => {
        const username = 'user1';
        const votableId = '63c699c7e146e1d8a6fe4198';
        const usernameVoteCounts = 25;
        const votableIdVoteCounts = 25;
        const bothVoteCounts = 15;
        it("get by username", async () => {
            const response = await vote.getVotesCount({ username });
            expect(response.status).toBe(200);
            expect(response.body.data).toBe(usernameVoteCounts);
        });
        it("get by votableId", async () => {
            const response = await vote.getVotesCount({ votableId });
            expect(response.status).toBe(200);
            expect(response.body.data).toBe(votableIdVoteCounts);
        });

        it("get by votableId, and username", async () => {
            const response = await vote.getVotesCount({ votableId, username });
            expect(response.status).toBe(200);
            expect(response.body.data).toBe(bothVoteCounts);
        });
    });

});


