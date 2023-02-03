import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Error } from '../Errors';

export default function Authenticate(request: Request, response: Response, next: NextFunction) {
  // Extract the Access token from the Authorization header
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // If the token is not present, return an error
    if (!token) {
        return response.status(400).json({
            error_code : Error.AUTH_UNAUTHORIZED
        });
    }
    try{
        let payload : any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.app.locals.username = payload.username;
    }
    catch (e) {
        return response.status(400).json({
            error_code : Error.AUTH_UNAUTHORIZED
        });
    }
        next();
}