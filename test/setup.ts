import mongoose from "mongoose";
import bson from "bson";
import fs from "fs";
import { shutdown } from "../src/app";
import UserModel from "../src/Models/User.model";
import PostModel from "../src/Models/Post.model";
import VoteModel from "../src/Models/Vote.model";
import CommentModel from "../src/Models/Comment.model";
// function hashPassword(password: string): string {
//     const hash = crypto.createHash('sha256');
//     hash.update(password);
//     return hash.digest('hex');
// }

const update = () => {
    const data = fs.readFileSync('test/test_db.json');
    const obj = JSON.parse(data.toString());
    const users = obj.users;
    const posts = obj.posts;
    const comments = obj.comments;
    const ids = [
        ['63c281359fa6b4c3ea2fef74',
            '63c281359fa6b4c3ea2fef75',
            '63c281359fa6b4c3ea2fef76',
            '63c281359fa6b4c3ea2fef77',
            '63c281359fa6b4c3ea2fef78',
        ], [
            '63c281359fa6b4c3ea2fef79',
            '63c281359fa6b4c3ea2fef7a',
            '63c281359fa6b4c3ea2fef7b',
            '63c281359fa6b4c3ea2fef7c',
            '63c281359fa6b4c3ea2fef7d',
            '63c699c7e146e1d8a6fe418a',
            '63c699c7e146e1d8a6fe418b',
            '63c699c7e146e1d8a6fe418c',
            '63c699c7e146e1d8a6fe418d',
            '63c699c7e146e1d8a6fe418e',
            '63c699c7e146e1d8a6fe418f',
            '63c699c7e146e1d8a6fe4190',
            '63c699c7e146e1d8a6fe4191',
            '63c699c7e146e1d8a6fe4192',
            '63c699c7e146e1d8a6fe4193',
            '63c699c7e146e1d8a6fe4194',
            '63c699c7e146e1d8a6fe4195',
            '63c699c7e146e1d8a6fe4196',
            '63c699c7e146e1d8a6fe4197',
            '63c699c7e146e1d8a6fe4198'
        ], [
            '63d64fc59dcbf6b709a147b2',
            '63d64fc59dcbf6b709a147b3',
            '63d64fc59dcbf6b709a147b4',
            '63d64fc59dcbf6b709a147b5',
            '63d64fc59dcbf6b709a147b6',
            '63d64fc59dcbf6b709a147b7',
            '63d64fc59dcbf6b709a147b8',
            '63d64fc59dcbf6b709a147b9',
            '63d64fc59dcbf6b709a147ba',
            '63d64fc59dcbf6b709a147bb',
            '63d64fc59dcbf6b709a147bc',
            '63d64fc59dcbf6b709a147bd',
            '63d64fc59dcbf6b709a147be',
            '63d64fc59dcbf6b709a147bf',
            '63d64fc59dcbf6b709a147c0',
            '63d64fc59dcbf6b709a147c1',
            '63d64fc59dcbf6b709a147c2',
            '63d64fc59dcbf6b709a147c3',
            '63d64fc59dcbf6b709a147c4',
            '63d64fc59dcbf6b709a147c5'
        ]];
    // users.forEach((user: any, i: number) => {
    //     user['id'] = ids[0][i];
    // });
    // comments.forEach((comment : any, i : number) => {
        // comment['postId'] = ids[1][i];
        // comment['_id'] = ids[2][i];
        // comment['parentCommentId'] = undefined;
    // });

    // console.log(comments.length);
    // posts.forEach((post: any, i: number) => {
    //     post['_id'] = ids[1][i];
    // });
    fs.writeFileSync('test/test_db.json', JSON.stringify(obj));
}
// update();

// export const loadDB = async () => {

//     const data = bson.deserialize(fs.readFileSync('test/test_db.bson'));
//     for (const collectionName in data) {
//         const collection = mongoose.connection.collection(collectionName);
//         await collection.insertMany(data[collectionName]);
//         // await collection.insertMany(data[collectionName].map((doc : any) => ({...doc, _id : new mongoose.Types.ObjectId(doc._id)})));
//     }
// }
export const loadDB = async () => {
    const data = bson.deserialize(fs.readFileSync('test/test_db.bson'));
    await UserModel.insertMany(data['users']);
    await PostModel.insertMany(data['posts']);
    await VoteModel.insertMany(data['votes']);
    await CommentModel.insertMany(data['comments']);
}
// export const deleteDB = async () => {
//     const collections = Object.keys(mongoose.connection.collections);
//     for (const collectionName of collections) {
//         const collection = mongoose.connection.collections[collectionName];
//         await collection.deleteMany({});
//     }
// }
export const deleteDB = async () => {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await VoteModel.deleteMany({});
    await CommentModel.deleteMany({});
}
export const setup = () => {
    beforeEach(loadDB);
    afterEach(deleteDB);
    afterAll(shutdown);
}