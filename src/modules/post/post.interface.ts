import mongoose from "mongoose";

export interface IPost {
  title: string;
  bio: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags?: string[];
  category: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  isPremium: boolean;
  thumbnail: string;
  comments: mongoose.Types.ObjectId[];
}
