import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Error } from "../Errors";
import CommentModel from "../Models/Comment.model";
import PostModel from "../Models/Post.model";


const DocumentExists = (model: mongoose.Model<any>, key: any) => {
    return (extractor : (request : Request) => any, falsyContinue : boolean = false) => {
        return (request: Request, response: Response, next: NextFunction) => {
            const value = extractor(request);
            
            if(falsyContinue)
                if(value === undefined) return next();

            model.find( {[key] : extractor(request)} )
                .then(data => data ? next() : response.status(400).json({ error_code: Error.DB_INVALID_ID }))
                .catch(error => response.status(400).json({ error_code: Error.SERVICE_UNKNOWN_ERROR }));
        }
    }
}

export const PostExists = DocumentExists(PostModel, "id");
export const CommentExists = DocumentExists(CommentModel, "id");