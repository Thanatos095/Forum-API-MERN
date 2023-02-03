import Comment from '../Models/Comment.model';
import mongoose from 'mongoose';
import { PaginationFilter } from '../types';
import { removeUndefinedValues } from '../Utility';

export default {
    addComment: (postId: string, body: string, author: string, parentCommentId?: string) => new Promise((resolve, reject) => {
        Comment.create({postId, body, author, ...removeUndefinedValues({parentCommentId})})
            .then(val => resolve(val.toObject()))
            .catch(err => reject(err));
    }),
    editComment: (id: string, body: string) => new Promise((resolve, reject) => {
        Comment.findOneAndUpdate( {id : new mongoose.Types.ObjectId(id)}, { body }, { new: true })
            .then(val => resolve(val))
            .catch(err => reject(err));
    }),
    deleteComment: (id: string) => new Promise<void>((resolve, reject) => {
        Comment.findOneAndDelete({id : new mongoose.Types.ObjectId(id)})
            .then(val => resolve(val?.toObject()))
            .catch(err => reject(err));
    }),
    getCommentsByPostId: (postId: string, paginationFilter: PaginationFilter) => new Promise((resolve, reject) => {
        let query = Comment.find({ postId : new mongoose.Types.ObjectId(postId) });
        paginationFilter.order && query.sort({ [paginationFilter.order.by]: paginationFilter.order.order === "DESC" ? -1 : 1 });
        paginationFilter.skip && query.skip(paginationFilter.skip);
        paginationFilter.limit && query.limit(paginationFilter.limit);
        query
            .then(data => resolve(data))
            .catch(error => reject(error));
    }),
    getCommentInfoById: (id: string, attributes: string[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            Comment.findById(id)
                .select(attributes.join(' '))
                .then(data => resolve(data?.toObject()))
                .catch((error) => reject(error));

        });
    },
};
