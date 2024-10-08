import mongoose, { Schema } from "mongoose";
import { IPost } from "./post.interface";

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const PostModel = mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
