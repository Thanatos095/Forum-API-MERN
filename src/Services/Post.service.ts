import Post from '../Models/Post.model';
import { PaginationFilter } from '../types';
import { removeUndefinedValues } from '../Utility';

export default {
    addPost: (author: string, title: string, body: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            Post.create({
                author : author,
                title: title,
                body: body,
            }, (error, data) => {
                if (error)
                    reject(error);
                else
                    resolve(data.toObject());
            });
        });
    },
    deletePost: (id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            Post.findByIdAndDelete(id)
                .then(data => resolve())
                .catch(error => reject(error));
        });
    },

    editPost: (id: string, updates : { title? : string, body?: string}): Promise<any> => {
        return new Promise((resolve, reject) => {
            Post.findByIdAndUpdate(id, removeUndefinedValues(updates), {new : true})
                .then(data => resolve(data?.toObject()))
                .catch(error => reject(error));
        });
    },
    getPostInfoById: (id: string, attributes: string[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            Post.findById(id)
                .select(attributes.join(' '))
                .then((data) => {
                    resolve(data?.toObject());
                })
                .catch((error) => reject(error));
        });
    },
    getPostsByTitle: (searchTerm: string, paginationFilter : PaginationFilter): Promise<any> => {
        return new Promise((resolve, reject) => {
            /*The regular expression $regex: searchTerm will match any titles that contain the search term
            The $options: 'i' flag makes the search case-insensitive*/
            let query = Post.find({ title: { $regex: searchTerm, $options: "i" } });
            
            paginationFilter.order && query.sort({[paginationFilter.order.by] : paginationFilter.order.order === "DESC" ? -1 : 1});
            paginationFilter.skip && query.skip(paginationFilter.skip);
            paginationFilter.limit && query.limit(paginationFilter.limit);
            query
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }    
};
