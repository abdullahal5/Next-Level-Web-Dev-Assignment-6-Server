import { IComment } from "./comment.interface";
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    commentText: { type: String, required: true },
  },
  { timestamps: true },
);

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
