import UserService from '../Services/User.service';
import { Error } from '../Errors';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config();

function hashPassword(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

const UserController = {
    register: (username: string, password: string, first_name: string, last_name: string, email: string, dob: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const usernameExists = await UserService.doesUsernameExist(username);
                if (usernameExists) return reject(Error.AUTH_USERNAME_ALREADY_EXISTS);
                const emailExists = await UserService.doesEmailExist(email);
                if (emailExists) return reject(Error.AUTH_EMAIL_ALREADY_EXISTS);
                const user = await UserService.createUser(username, hashPassword(password), first_name, last_name, email, new Date(dob));
                resolve({
                    data: Object.assign({}, user, { password: undefined }),
                    token: Jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET)
                });
            }
            catch (error) {
                reject(error);
            }
        });
    },
    login: (username: string, password: string) => {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const user = await UserService.getUserInfoByUsername(username, []);
                if (user && user.password === hashPassword(password))
                    return resolve({
                        data: Object.assign({}, user, { password: undefined }),
                        token: Jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET)
                    });
                else return reject(Error.AUTH_INVALID_EMAIL_PASSWORD)
            }
            catch ( error ) {
                reject(error);
            } 
        });
    }
}
export default UserController;