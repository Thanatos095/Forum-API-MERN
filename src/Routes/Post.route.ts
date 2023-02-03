import { Router } from "express";
import { controllerHandler } from "../Controllers/ControllerHandler";
import PostController from '../Controllers/Post.controller';
import Authenticate from '../MiddleWare/Authenticate';
import { Validate } from "../MiddleWare/Validate";
import { PostValidator } from "../ValidationRules/Post.rules";
const router = Router();

router.post(
    '/add',
    Authenticate,
    Validate(PostValidator.addPost),
    controllerHandler(
        request => PostController.addPost(
            request.app.locals.username,
            request.body.title, 
            request.body.body
        )
    )
);

router.delete(
    '/delete/:id',
    Authenticate,
    Validate(PostValidator.deletePost),
    controllerHandler(
        request => PostController.deletePost(request.params.id, request.app.locals.username)
    )
);

router.put(
    '/edit/:id',
    Authenticate,
    Validate(PostValidator.editPost),
    controllerHandler(
        request => PostController.editPost(
            request.params.id, 
            request.app.locals.username, 
            request.body.title, 
            request.body.body
        )
    )
);

router.get(
    '/search',
    Validate(PostValidator.searchByTitle),
    controllerHandler(
        request => {
            return PostController.searchByTitle(
                request.query.search as string,
                {
                    order : request.query.order as any,
                    limit : Number(request.query.limit),
                    skip : Number(request.query.skip)
                }
            )
        }
    )
);
export default router;