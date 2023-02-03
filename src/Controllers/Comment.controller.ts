import { Error } from '../Errors';
import CommentService from '../Services/Comment.service';
import { PaginationFilter } from '../types';

const CommentController = {
    addComment: (postId: string, author: string, body: string, parentCommentId?: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const comment = await CommentService.addComment(postId, body, author, parentCommentId);
                resolve({ data: comment });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    deleteComment: (id: string, sender_username: string) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                
                const comment = await CommentService.getCommentInfoById(id, ["author"]);
                if (!comment) return reject(Error.COMMENT_INVALID_ID);
                // console.log("DEBUGG", sender_username, comment.author);
                if(sender_username !== comment.author){
                    return reject(Error.COMMENT_UNAUTHORIZED_MODIFICATION);
                }           
                // if (sender_username !== comment.author) return reject(Error.COMMENT_UNAUTHORIZED_MODIFICATION);

                await CommentService.deleteComment(id);
                resolve();
            }
            catch (error) {
                reject(Error.SERVICE_UNKNOWN_ERROR);
            }
        });
    },
    editComment: (id: string, sender_username: string, body: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const comment = await CommentService.getCommentInfoById(id, ["author"]);
                if (!comment) return reject(Error.COMMENT_INVALID_ID);
                if (sender_username !== comment.author) return reject(Error.COMMENT_UNAUTHORIZED_MODIFICATION);
                const updated_comment = await CommentService.editComment(id, body);
                resolve({ data: updated_comment });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    getCommentsByPostId: (postId: string, paginationFilter: PaginationFilter) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const comments = await CommentService.getCommentsByPostId(postId, paginationFilter);
                resolve({ data: comments });
            }
            catch (error) {
                reject(error);
            }
        });
    },
};

export default CommentController;