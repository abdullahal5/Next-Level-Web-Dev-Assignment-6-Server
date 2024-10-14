import httpStatus from "http-status";
import { IPost } from "./post.interface";
import PostModel from "./post.model";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";

const createPostIntoDB = async (body: IPost) => {
  const result = await PostModel.create(body);
  return result;
};

const updatePostInDB = async (id: string, body: Partial<IPost>) => {
  const result = await PostModel.findByIdAndUpdate(id, body, { new: true });
  return result;
};

const getAllPostsFromDB = async () => {
  const result = await PostModel.find().populate("author comments");
  return result;
};

const getPostByIdFromDB = async (id: string) => {
  const result = await PostModel.findById(id)
    .populate("author")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
      },
    });
  return result;
};

const deletePostFromDB = async (id: string) => {
  console.log(id);
  const result = await PostModel.findByIdAndDelete(id);
  return result;
};

const upvotesAndDownvotesFromDB = async (
  postID: string,
  userID: string,
  voteType: "upvote" | "downvote",
) => {
  const userObjectId = new mongoose.Types.ObjectId(userID);

  const post = await PostModel.findById(postID);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const upvotes = post.upvotes || [];
  const downvotes = post.downvotes || [];

  const hasUpvoted = upvotes.some((upvote: mongoose.Types.ObjectId) =>
    upvote.equals(userObjectId),
  );
  const hasDownvoted = downvotes.some((downvote: mongoose.Types.ObjectId) =>
    downvote.equals(userObjectId),
  );

  if (voteType === "upvote") {
    if (hasUpvoted) {
      await PostModel.updateOne(
        { _id: postID },
        { $pull: { upvotes: userObjectId } },
      );
    } else {
      if (hasDownvoted) {
        await PostModel.updateOne(
          { _id: postID },
          { $pull: { downvotes: userObjectId } },
        );
      }

      await PostModel.updateOne(
        { _id: postID },
        { $push: { upvotes: userObjectId } },
      );
    }
  } else if (voteType === "downvote") {
    if (hasDownvoted) {
      await PostModel.updateOne(
        { _id: postID },
        { $pull: { downvotes: userObjectId } },
      );
    } else {
      if (hasUpvoted) {
        await PostModel.updateOne(
          { _id: postID },
          { $pull: { upvotes: userObjectId } },
        );
      }
      await PostModel.updateOne(
        { _id: postID },
        { $push: { downvotes: userObjectId } },
      );
    }
  }
};

const getMypost = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const result = await PostModel.find({ author: objectId }).populate("author");
  return result;
};

export const postServices = {
  createPostIntoDB,
  updatePostInDB,
  getAllPostsFromDB,
  getPostByIdFromDB,
  deletePostFromDB,
  upvotesAndDownvotesFromDB,
  getMypost,
};
