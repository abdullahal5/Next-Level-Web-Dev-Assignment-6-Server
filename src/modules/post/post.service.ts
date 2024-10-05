import httpStatus from "http-status";
import { IPost } from "./post.interface";
import PostModel from "./post.model";
import AppError from "../../errors/AppError";

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
  const result = await PostModel.findByIdAndDelete(id);
  return result;
};

const upvotesAndDownvotesFromDB = async (postID: string, voteType: string) => {
  const isExistPost = await PostModel.findById(postID);

  if (!isExistPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Not found");
  }

  if (voteType === "increment") {
    await PostModel.updateOne({ _id: postID }, { $inc: { upvotes: 1 } });
  } else {
    await PostModel.updateOne({ _id: postID }, { $inc: { downvotes: 1 } });
  }
};

export const postServices = {
  createPostIntoDB,
  updatePostInDB,
  getAllPostsFromDB,
  getPostByIdFromDB,
  deletePostFromDB,
  upvotesAndDownvotesFromDB,
};
