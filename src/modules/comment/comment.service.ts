import AppError from "../../errors/AppError";
import { IComment } from "./comment.interface";
import CommentModel from "./comment.model";
import httpStatus from "http-status";

const createCommentIntoDB = async (body: IComment) => {
  const result = await CommentModel.create(body);
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

const deleteCommentFromDB = async (
  commentId: string,
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
      "You are not authorized to delete this comment",
    );
  }

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
