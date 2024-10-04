import { IComment } from "./comment.interface";
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    profileImage: { type: String },
    commentText: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
