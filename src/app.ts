import mongoose from "mongoose";
import express from "express";
import AuthRoute from "./Routes/Auth.route";
import PostRoute from "./Routes/Post.route";
import VoteRoute from "./Routes/Vote.route";
import CommentRoute from "./Routes/Comment.route";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
    }
  }
}

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/forum');

export const app = express();

app.use(express.json());

app.use('/auth', AuthRoute);
app.use('/post', PostRoute);
app.use('/vote', VoteRoute);
app.use('/comment', CommentRoute);
export const shutdown = () => {
  return mongoose.connection.close();
}