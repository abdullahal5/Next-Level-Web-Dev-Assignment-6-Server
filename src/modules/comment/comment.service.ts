import AppError from "../../errors/AppError";
import PostModel from "../post/post.model";
import { IComment } from "./comment.interface";
import CommentModel from "./comment.model";
import httpStatus from "http-status";

const createCommentIntoDB = async (body: IComment) => {
  const result = await CommentModel.create(body);

  await PostModel.updateOne(
    { _id: body.postId },
    { $push: { comments: result._id } },
  );

  await PostModel.updateOne(
    { _id: body.postId },
    { $inc: { commentsCount: 1 } },
  );

  return result;
};

const getAllCommentsFromDB = async () => {
  const comments = await CommentModel.find();
  return comments;
};

const getSingleCommentFromDB = async (commentId: string) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }
  return comment;
};

const updateCommentInDB = async (
  commentId: string,
  updateBody: Partial<IComment>,
  userId: string,
  userRole: string,
) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.userId.toString() !== userId && userRole !== "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to edit this comment",
    );
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    updateBody,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedComment;
};

const incrementVotesInDB = async (
  commentId: string,
  voteType: "upvotes" | "downvotes",
) => {
  const update =
    voteType === "upvotes"
      ? { $inc: { upvotes: 1 } }
      : { $inc: { downvotes: 1 } };

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    update,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  return updatedComment;
};

const deleteCommentFromDB = async (commentId: string, userId: string) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const checkIsUser = comment.userId.toString() === userId.toString();

  if (!checkIsUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "forbidden");
  }

  await PostModel.updateOne(
    { _id: comment.postId },
    { $pull: { comments: comment._id } },
  );

  await PostModel.updateOne(
    { _id: comment.postId },
    { $inc: { commentsCount: -1 } },
  );

  const deletedComment = await CommentModel.findByIdAndDelete(commentId);
  return deletedComment;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsFromDB,
  getSingleCommentFromDB,
  updateCommentInDB,
  incrementVotesInDB,
  deleteCommentFromDB,
};
