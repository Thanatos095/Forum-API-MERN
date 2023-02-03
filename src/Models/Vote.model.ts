import mongoose from "mongoose";
import { Votable } from "../types";
const votesSchema = new mongoose.Schema({
  type :{
    type : String,
    enum : ["Post", "Comment"],
    required : true
  },
  votableId : {
    type : mongoose.Types.ObjectId,
    required : true,
    index : true,
  },
  username : {
    type: String,
    required: true,
    index : true,
  },
  value : {
    type : Number,
    enum : [1, -1]
  }
}, { timestamps : true});

votesSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
  }
});

votesSchema.set('toObject', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
  }
});
export default mongoose.model('Vote', votesSchema);