import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const result = await CommentServices.createCommentIntoDB(req.body);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Created Successfully",
    data: result,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const commentId = req.params.id;
  const result = await CommentServices.getSingleCommentFromDB(commentId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment fetched successfully",
    data: result,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const comments = await CommentServices.getAllCommentsFromDB();

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments fetched successfully",
    data: comments,
  });
});

// const updateComment = catchAsync(async (req, res) => {
//   const commentId = req.params.id;
//   const userId = req.user.userId as JwtPayload;
//   const userRole = req.user.role;

//   const result = await CommentServices.updateCommentInDB(commentId, req.body, userId, userRole);

//   SendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Comment updated successfully",
//     data: result,
//   });
// });

// const incrementVote = catchAsync(async (req, res) => {
//   const commentId = req.params.id;
//   const { voteType } = req.body;

//   const result = await CommentServices.incrementVotesInDB(commentId, voteType);

//   SendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Comment ${voteType} incremented successfully`,
//     data: result,
//   });
// });

const deleteComment = catchAsync(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user?.userId;

  await CommentServices.deleteCommentFromDB(commentId, userId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: undefined,
  });
});

export const CommentController = {
  createComment,
  getSingleComment,
  getAllComments,
  //   updateComment,
  //   incrementVote,
  deleteComment,
};
