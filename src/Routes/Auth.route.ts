import { Router } from "express";
import { controllerHandler } from "../Controllers/ControllerHandler";
import UserController from '../Controllers/User.controller';
import { Validate } from "../MiddleWare/Validate";
import { validator as UserValidator } from "../ValidationRules/User.rules";
const router = Router();

router.post(
    '/register',
    Validate(UserValidator.register),
    controllerHandler((request) => UserController.register(
        request.body.username,
        request.body.password,
        request.body.first_name,
        request.body.last_name,
        request.body.email,
        request.body.dob)
    )
);
    
router.post(
    '/login',
    Validate(UserValidator.login), 
    controllerHandler((request) => UserController.login(request.body.username, request.body.password))
);
export default router;