"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.CommentServices.createCommentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment Created Successfully",
        data: result,
    });
}));
const getSingleComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const result = yield comment_service_1.CommentServices.getSingleCommentFromDB(commentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment fetched successfully",
        data: result,
    });
}));
const getAllComments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_service_1.CommentServices.getAllCommentsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comments fetched successfully",
        data: comments,
    });
}));
const updateComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const result = yield comment_service_1.CommentServices.updateCommentInDB(commentId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment updated successfully",
        data: result,
    });
}));
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
const deleteComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const commentId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield comment_service_1.CommentServices.deleteCommentFromDB(commentId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment deleted successfully",
        data: undefined,
    });
}));
exports.CommentController = {
    createComment,
    getSingleComment,
    getAllComments,
    updateComment,
    //   incrementVote,
    deleteComment,
};
