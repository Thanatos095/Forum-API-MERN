import Joi from "joi"
import { UserRules } from "./User.rules";
import { Rules } from "./Rules";

export const CommentRules = new Rules({
    order : Joi.object({
        order : Joi.string().valid("ASC", "DESC"),
        by : Joi.string().valid("upvotes", "createdAt"),
    }),
    skip: Joi.number().integer(),
    limit: Joi.number().integer(),
    body: Joi.string().min(1),
    postId: Joi.string(),
    parentCommentId: Joi.string(),
    id : Joi.string(),
});

export const CommentValidator = {
    addComment : {
        body : CommentRules.extractSubset(['body', 'postId']).makeRequired()
               .merge(CommentRules.extractSubset(['parentCommentId']))
    },
    deleteComment : {
        params : CommentRules.extractSubset(['id']).makeRequired()
    },
    editComment : {
        params : CommentRules.extractSubset(['id']).makeRequired(),
        body : CommentRules.extractSubset(['body']).makeRequired(),
    },
    getComments : {
        params : CommentRules.extractSubset(['postId']).makeRequired(),
        query : CommentRules.extractSubset(['order', 'skip', 'limit'])
    }
}