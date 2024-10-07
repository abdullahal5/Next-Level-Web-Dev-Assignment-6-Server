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
exports.CommentServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = __importDefault(require("../post/post.model"));
const comment_model_1 = __importDefault(require("./comment.model"));
const http_status_1 = __importDefault(require("http-status"));
const createCommentIntoDB = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.default.create(body);
    yield post_model_1.default.updateOne({ _id: body.postId }, { $push: { comments: result._id } });
    yield post_model_1.default.updateOne({ _id: body.postId }, { $inc: { commentsCount: 1 } });
    return result;
});
const getAllCommentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_model_1.default.find();
    return comments;
});
const getSingleCommentFromDB = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    return comment;
});
const updateCommentInDB = (commentId, updateBody, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    if (comment.userId.toString() !== userId && userRole !== "admin") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to edit this comment");
    }
    const updatedComment = yield comment_model_1.default.findByIdAndUpdate(commentId, updateBody, {
        new: true,
        runValidators: true,
    });
    return updatedComment;
});
const incrementVotesInDB = (commentId, voteType) => __awaiter(void 0, void 0, void 0, function* () {
    const update = voteType === "upvotes"
        ? { $inc: { upvotes: 1 } }
        : { $inc: { downvotes: 1 } };
    const updatedComment = yield comment_model_1.default.findByIdAndUpdate(commentId, update, {
        new: true,
        runValidators: true,
    });
    if (!updatedComment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    return updatedComment;
});
const deleteCommentFromDB = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    const checkIsUser = comment.userId.toString() === userId.toString();
    if (!checkIsUser) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "forbidden");
    }
    yield post_model_1.default.updateOne({ _id: comment.postId }, { $pull: { comments: comment._id } });
    yield post_model_1.default.updateOne({ _id: comment.postId }, { $inc: { commentsCount: -1 } });
    const deletedComment = yield comment_model_1.default.findByIdAndDelete(commentId);
    return deletedComment;
});
exports.CommentServices = {
    createCommentIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
    updateCommentInDB,
    incrementVotesInDB,
    deleteCommentFromDB,
};
