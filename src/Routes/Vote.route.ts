import VoteController from '../Controllers/Vote.controller';
import { Router } from "express";
import { controllerHandler } from '../Controllers/ControllerHandler';
import Authenticate from '../MiddleWare/Authenticate';
import { PostExists } from '../MiddleWare/DocumentExists';
import { Validate } from '../MiddleWare/Validate';
import { voteValidator } from '../ValidationRules/Vote.rules';
const router = Router();

const votables = ["Post", "Commment"];

votables.forEach(votable => {
   const voter = new VoteController(votable);

   router.post(`/make${votable}Vote/:votableId`,
      Authenticate,
      Validate(voteValidator.vote),
      PostExists(request => request.params.votableId),
      controllerHandler(request =>
         voter.vote(request.params.votableId, request.app.locals.username, request.body.value)));

   router.delete(`/delete${votable}Vote/:votableId`,
      Authenticate,
      Validate(voteValidator.deleteVote),
      PostExists(request => request.params.votableId),
      controllerHandler(request =>
         voter.removeVote(request.params.votableId, request.app.locals.username)));

   router.get(`/get${votable}Votes`,
      Validate(voteValidator.getVotes),
      controllerHandler(request =>
         voter.getVotes({
            votableId: request.query.votableId as string,
            username: request.query.username as string
         })
      ));

   router.get(`/get${votable}VotesCount`,
      Validate(voteValidator.getVotesCount),
      controllerHandler(request =>
         voter.getVotesCount({
            votableId: request.query.votableId as string,
            username: request.query.username as string
         })
      ));
});

export default router;




