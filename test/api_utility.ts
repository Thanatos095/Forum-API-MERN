import supertest from "supertest";
import { app } from "../src/app";
import { PaginationFilter } from "../src/types";

const routes = {
    login: '/auth/login',
    register: '/auth/register',
    addPost: '/post/add',
    deletePost: (id: string) => `/post/delete/${id}`,
    editPost: (id: string) => `/post/edit/${id}`,
    searchByTitle: '/post/search',
    voteOnPost: (votableId: string) => `/vote/makePostVote/${votableId}`,
    deleteVote: (votableId: string) => `/vote/deletePostVote/${votableId}`,
    getVotes : "/vote/getPostVotes",
    getVotesCount : "/vote/getPostVotesCount",
    addComment: '/comment/add',
    deleteComment: (id: string) => `/comment/delete/${id}`,
    editComment: (id: string) => `/comment/edit/${id}`,
    getComments: (postId: string) => `/comment/get/${postId}`
}

export const auth = {
    login: (params: { username?: string, password?: string }) => {
        return supertest(app).post(routes.login).send({ username: params.username, password: params.password });
    },
    register: (params: { username?: string, password?: string, first_name?: string, last_name?: string, email?: string, dob?: string }) => {
        return supertest(app).post(routes.register).send({
            username: params.username,
            password: params.password,
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            dob: params.dob
        });
    }
}

export const post = {
    addPost: (params: { token?: string, title?: string, body?: string }) => {
        return supertest(app)
            .post(routes.addPost)
            .set('Authorization', `BEARER ${params.token}`)
            .send({ title: params.title, body: params.body });
    },
    deletePost: (params: { id?: string, token?: string }) => {
        return supertest(app)
            .delete(routes.deletePost(params.id || ""))
            .set('Authorization', `BEARER ${params.token}`);
    },
    editPost: (params: { id?: string, token?: string, title?: string, body?: string }) => {
        return supertest(app)
            .put(routes.editPost(params.id || ""))
            .set('Authorization', `BEARER ${params.token}`)
            .send({ title: params.title, body: params.body });
    },
    searchByTitle: (params: { search?: string, paginationFilter?: PaginationFilter }) => {
        return supertest(app)
            .get(routes.searchByTitle)
            .query({ search: params.search, ...params.paginationFilter });
    }
}

export const vote = {
    vote: (params: { token?: string, votableId?: string, value?: 1 | -1 }) =>
        supertest(app)
            .post(routes.voteOnPost(params.votableId || ""))
            .set('Authorization', `BEARER ${params.token}`)
            .send({ value: params.value }),

    removeVote: (params: { token?: string, votableId?: string }) =>
        supertest(app)
            .delete(routes.deleteVote(params.votableId || ""))
            .set('Authorization', `BEARER ${params.token}`),

    getVotes : (params : {votableId ?: string, username ?: string}) =>
        supertest(app)
            .get(routes.getVotes)
            .query(params),
    
    getVotesCount : (params : {votableId ?: string, username ?: string}) =>
        supertest(app)
            .get(routes.getVotesCount)
            .query(params)

}

export const comment = {
    addComment: (params: { token?: string, postId?: string, body?: string, parentCommentId?: string }) => {
        return supertest(app)
            .post(routes.addComment)
            .set('Authorization', `BEARER ${params.token}`)
            .send({ postId: params.postId, body: params.body, parentCommentId: params.parentCommentId });
    },
    deleteComment: (params: { id?: string, token?: string }) => {
        return supertest(app)
            .delete(routes.deleteComment(params.id || ""))
            .set('Authorization', `BEARER ${ params.token }`);
    },
    editComment: (params: { id?: string, token?: string, body?: string }) => {
        return supertest(app)
            .put(routes.editComment(params.id || ""))
            .set('Authorization', `BEARER ${ params.token }`)
            .send({ body: params.body });
    },
    getComments: (params: { postId?: string, paginationFilter?: PaginationFilter }) => {
        return supertest(app)
            .get(routes.getComments(params.postId || ""))
            .query({ ...params.paginationFilter });
    }
}