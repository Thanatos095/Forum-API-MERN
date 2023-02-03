import User from '../Models/User.model';
import mongoose from 'mongoose';
export default {
    createUser: (username: string, password: string, first_name: string, last_name: string, email: string, dob: Date) : Promise<any> => {
        return new Promise((resolve, reject) => {
            User.create({
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name,
                email: email,
                dob: dob
            }, (error, data) => {
                if (error) {
                    reject(error);
                }
                else
                    resolve(data?.toObject());
            });
        });
    },
    getUserInfoByUsername : (username : string, attributes : string[]) : Promise<any> => {
        return new Promise((resolve, reject) => 
            User.findOne({username : username})
                .select(attributes.join(' '))
                .then(data => resolve(data?.toObject()))
                .catch(error => reject(error))
        );
    },
    doesUsernameExist : (username : string) : Promise<any> => {
        return new Promise((resolve, reject) => {
            User.exists({username : username})
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    },
    doesEmailExist : (email : string) : Promise<any> => {
        return new Promise((resolve, reject) => {
            User.exists({email : email})
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }
}