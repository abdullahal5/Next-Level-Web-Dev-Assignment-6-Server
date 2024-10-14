import mongoose from "mongoose";

export interface IPost {
  title: string;
  bio: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags?: string[];
  category: string;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  commentsCount: number;
  isPremium: boolean;
  thumbnail: string;
  comments: mongoose.Types.ObjectId[];
}
