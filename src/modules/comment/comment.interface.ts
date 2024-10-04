import { Schema } from "mongoose";

export interface IComment {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  username: string;
  profileImage?: string;
  commentText: string;
  upvotes: number;
  downvotes: number;
}
