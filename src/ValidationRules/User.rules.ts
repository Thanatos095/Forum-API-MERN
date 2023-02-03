import Joi from "joi"
import { Rules } from "./Rules";
// const ageToDate = (age : number) => {
//     const date = new Date();
//     date.setFullYear(date.getFullYear() - age);
//     return date;
// } 

export const UserRules = new Rules({
    username: Joi.string().min(3),
    password: Joi.string().min(4),
    first_name: Joi.string().min(2),
    last_name: Joi.string().min(2),
    email: Joi.string().email(),
    dob: Joi.date(),
});



export const validator = {
    register : {
        body : UserRules.makeRequired(),
    },
    login :{
        body : UserRules.extractSubset(['username', 'password']).makeRequired(),
    }
}