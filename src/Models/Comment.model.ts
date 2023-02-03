import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  postId : {
    type : mongoose.Types.ObjectId,
    required : true
  },
  body : {
    type : String,
    required : true,
  },
  author : {
    type : String,
    required : true
  },
  parentCommentId : {
    type : mongoose.Types.ObjectId,
  },
}, { timestamps : true});

commentsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
  }
});

commentsSchema.set('toObject', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
  }
});

export default mongoose.model('Comment', commentsSchema);