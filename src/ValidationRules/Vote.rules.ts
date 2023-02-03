import Joi from "joi"
import { Rules } from "./Rules";
import { UserRules } from "./User.rules";
export const VoteRules = new Rules({
    username : UserRules.get('username'),
    votableId : Joi.string(),
    value : Joi.number().integer().valid(1, -1)
});

export const voteValidator = {
    vote : {
        params : VoteRules.extractSubset(["votableId"]).makeRequired(),
        body : VoteRules.extractSubset(["value"]).makeRequired()
    },
    deleteVote : {
        params : VoteRules.extractSubset(["votableId"]).makeRequired()
    },
    getVotes : {
        query : VoteRules.extractSubset(['username', 'votableId'])
    },
    getVotesCount : {
        query : VoteRules.extractSubset(['username', 'votableId'])
    }
};

