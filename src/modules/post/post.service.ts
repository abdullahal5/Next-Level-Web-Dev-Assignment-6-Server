import { IPost } from "./post.interface";
import PostModel from "./post.model";

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
  const result = await PostModel.findById(id).populate("author comments");
  return result;
};

const deletePostFromDB = async (id: string) => {
  const result = await PostModel.findByIdAndDelete(id);
  return result;
};

export const postServices = {
  createPostIntoDB,
  updatePostInDB,
  getAllPostsFromDB,
  getPostByIdFromDB,
  deletePostFromDB,
};
