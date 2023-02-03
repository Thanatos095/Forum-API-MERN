import mongoose from 'mongoose';
import Votes from '../Models/Vote.model';
import { removeUndefinedValues } from '../Utility';
export default {
    getVotes: (type: string, votableId?: string, username?: string, value?: 1 | -1) => {
        return new Promise<any>((resolve, reject) => {
            Votes.find({ type, ...removeUndefinedValues({votableId, username, value})})
                .then(val => resolve(val))
                .catch(error => reject(error));
        });
    },
    getVotesCount: (type: string, votableId?: string, username?: string) => {
        return new Promise<any>((resolve, reject) => {
            Votes.countDocuments({type, ...removeUndefinedValues({votableId, username})})
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    },
    createVote: (type: string, votableId: string, username: string, value: 1 | -1) => {
        return new Promise<any>((resolve, reject) => {
            Votes.create({
                type,
                votableId: new mongoose.Types.ObjectId(votableId),
                username,
                value
            })
                .then(val => resolve(val.toObject()))
                .catch(err => reject(err));
        });
    },
    updateVote: (type: string, votableId: string, username: string, value: 1 | -1) => {
        return new Promise<any>((resolve, reject) => {
            Votes.findOneAndUpdate({ type, votableId: new mongoose.Types.ObjectId(votableId), username },
                { $inc: { value } })
                .then(val => resolve(val?.toObject()))
                .catch(err => reject(err));
        });
    },
    deleteVote: (type: string, votableId: string, username: string) => {
        return new Promise<void>((resolve, reject) => {
            Votes.deleteOne({ type, votableId: new mongoose.Types.ObjectId(votableId), username })
                .then(val => resolve())
                .catch(err => reject(err));
        });
    }
}