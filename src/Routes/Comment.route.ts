import { Router } from "express";
import { controllerHandler } from "../Controllers/ControllerHandler";
import CommentController from '../Controllers/Comment.controller';
import { Validate } from "../MiddleWare/Validate";
import { CommentValidator } from "../ValidationRules/Comments.rules";
import Authenticate from "../MiddleWare/Authenticate";
import { CommentExists, PostExists } from "../MiddleWare/DocumentExists";
const router = Router();

router.get('/get/:postId',
    Validate(CommentValidator.getComments),
    controllerHandler(request => CommentController.getCommentsByPostId(request.params.postId, {
        order: request.query.order as any,
        limit: Number(request.query.limit),
        skip: Number(request.query.skip)
    })));

router.post('/add', 
    Authenticate,
    Validate(CommentValidator.addComment),
    PostExists(request => request.body.postId),
    CommentExists(request => request.body.parentCommentId, true),
    controllerHandler(
        request => CommentController.addComment(request.body.postId, request.app.locals.username, request.body.body, request.body.parentCommentId)
    ));

router.delete('/delete/:id',
    Authenticate,
    Validate(CommentValidator.deleteComment),
    CommentExists(request => request.params.id),
    controllerHandler(
        request => CommentController.deleteComment(request.params.id, request.app.locals.username)
    ));

router.put('/edit/:id',
    Authenticate,
    Validate(CommentValidator.editComment),
    CommentExists(request => request.params.id),
    controllerHandler(
        request => CommentController.editComment(request.params.id, request.app.locals.username, request.body.body)
    ));

export default router;