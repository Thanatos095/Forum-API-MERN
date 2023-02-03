import Joi from "joi"
import { UserRules } from "./User.rules";
import { Rules } from "./Rules";

export const PostRules = new Rules({
    order : Joi.object({
        order : Joi.string().valid("ASC", "DESC"),
        by : Joi.string().valid("upvotes", "createdAt"),
    }),
    skip: Joi.number().integer(),
    limit: Joi.number().integer(),
    title: Joi.string().min(2),
    body: Joi.string().min(1),
    id: Joi.string(),
    // .hex().length(24),
    search : Joi.string().min(2)
});

export const PostValidator = {
    addPost : {
        body : PostRules.extractSubset(['title', 'body']).makeRequired()
    },
    deletePost : {
        params : PostRules.extractSubset(['id']).makeRequired()
    },
    editPost : {
        params : PostRules.extractSubset(['id']).makeRequired(),
        body : PostRules.extractSubset(['title', 'body'])
    },
    searchByTitle : {
        query : PostRules.extractSubset(['search']).makeRequired().merge(
            PostRules.extractSubset(['order', 'skip', 'limit'])
        )
    }
}