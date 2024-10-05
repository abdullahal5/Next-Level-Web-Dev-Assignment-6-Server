import { Schema } from "mongoose";

export interface IComment {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  commentText: string;
}
