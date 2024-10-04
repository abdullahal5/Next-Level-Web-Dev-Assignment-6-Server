import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { postServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  const result = await postServices.createPostIntoDB(req.body);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Created Successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.updatePostInDB(id, req.body);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Updated Successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await postServices.getAllPostsFromDB();

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts Retrieved Successfully",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.getPostByIdFromDB(id);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Retrieved Successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await postServices.deletePostFromDB(id);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Deleted Successfully",
    data: null,
  });
});

export const PostController = {
  createPost,
  updatePost,
  getAllPosts,
  getSinglePost,
  deletePost,
};