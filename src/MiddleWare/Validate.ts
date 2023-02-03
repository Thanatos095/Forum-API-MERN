import { Request, Response, NextFunction } from "express"
import { RequestValidation } from "../ValidationRules/Rules";
export const Validate = (rules : RequestValidation) => {
    return (request : Request, response : Response, next : NextFunction ) => {
        
        let keys = Object.keys(rules) as Array<"body" | "query" | "params">;
        for(let i = 0 ; i < keys.length ; i++){
            const results = rules[keys[i]]!.validate(request[keys[i]]); 
            if(results.error){
                return response.status(400).json(results.error);
            }
        }
        next();
    }
} 