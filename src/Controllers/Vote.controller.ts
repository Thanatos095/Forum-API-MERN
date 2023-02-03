import VoteService from "../Services/Vote.service";
import { Error } from "../Errors";
class VoteController {
    readonly type : string;    
    constructor(type : string){
        this.type = type;
    }

    vote(votableId : string, username : string, value : 1 | -1){
        return new Promise<any>(async (resolve, reject) => {
            try{
                const votes = await VoteService.getVotes(this.type, votableId, username, value);
                if(votes.length === 0){
                    return resolve({ data : await VoteService.createVote(this.type, votableId, username, value) });
                }
                else{
                    if(votes[0].username !== username) return reject(Error.VOTES_UNAUTHORIZED_MODIFICATION);
                    return resolve({ data : await VoteService.updateVote(this.type, votableId, username, value) });    
                }
            }
            catch(error){
                console.log("MY error", error);
                reject(Error.SERVICE_UNKNOWN_ERROR);
            }
        });
    }
    removeVote(votableId : string, username : string){
        return new Promise<void>(async (resolve, reject) => {
            try{
                await VoteService.deleteVote(this.type, votableId, username);
                resolve();
            }
            catch(error){
                reject(Error.SERVICE_UNKNOWN_ERROR);
            }
        });
    }
    getVotes(query : { votableId ?: string, username ?: string}){
        return new Promise<any>(async (resolve, reject) => {
            try{
                const votes = await VoteService.getVotes(this.type, query.votableId, query.username);
                resolve({ data : votes});        
            }
            catch(error){
                reject(Error.SERVICE_UNKNOWN_ERROR);
            }
        });
    }
    getVotesCount(query : { votableId ?: string, username ?: string}){
        return new Promise<any>(async (resolve, reject) => {
            try{
                const count = await VoteService.getVotesCount(this.type, query.votableId, query.username);
                resolve({ data : count});        
            }
            catch(error){
                reject(Error.SERVICE_UNKNOWN_ERROR);
            }
        });
    }
}
export default VoteController;
