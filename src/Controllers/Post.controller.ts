import { Request, Response } from 'express';
import PostService from '../Services/Post.service';
import { PaginationFilter } from '../types';
import { Error } from '../Errors';
const PostController = {
    addPost: (author: string, title: string, body: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const post = await PostService.addPost(author, title, body);
                resolve({ data: post });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    deletePost: (id: string, sender_username: string) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const post = await PostService.getPostInfoById(id, ["author"]);
                if (!post) return reject(Error.POST_INVALID_ID);
                if (sender_username !== post.author) return reject(Error.POST_UNAUTHORIZED_MODIFICATION);
                await PostService.deletePost(id);
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    editPost: (id: string, sender_username: string, title ?: string, body ?: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const post = await PostService.getPostInfoById(id, ["author"]);
                if (!post) return reject(Error.POST_INVALID_ID);
                if (sender_username !== post.author) return reject(Error.POST_UNAUTHORIZED_MODIFICATION);
                const updated_post = await PostService.editPost(id, {title : title, body : body});
                resolve({ data : updated_post });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    searchByTitle : (search : string, paginationFilter : PaginationFilter) => {
        return new Promise<any>(async (resolve, reject) => {
            try{
                const posts = await PostService.getPostsByTitle(search, paginationFilter);
                resolve({ data : posts });
            }
            catch (error){
                reject(error);
            }
        });
    }
};

export default PostController;
