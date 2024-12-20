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
exports.postServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const post_model_1 = __importDefault(require("./post.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPostIntoDB = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.create(body);
    return result;
});
const updatePostInDB = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findByIdAndUpdate(id, body, { new: true });
    return result;
});
const getAllPostsFromDB = (searchQuery, categoriesQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {};
    if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, "i");
        filters.$or = [
            { title: { $regex: searchRegex } },
            { bio: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
        ];
    }
    if (categoriesQuery && categoriesQuery.toLowerCase() !== "all") {
        const categoryRegex = new RegExp(categoriesQuery, "i");
        filters.category = { $regex: categoryRegex };
    }
    const results = yield post_model_1.default.find(filters)
        .populate("author comments")
        .sort({ createdAt: -1 });
    return results;
});
const getPostByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findById(id)
        .populate("author")
        .populate({
        path: "comments",
        populate: {
            path: "userId",
        },
    });
    return result;
});
const deletePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const result = yield post_model_1.default.findByIdAndDelete(id);
    return result;
});
const upvotesAndDownvotesFromDB = (postID, userID, voteType) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectId = new mongoose_1.default.Types.ObjectId(userID);
    const post = yield post_model_1.default.findById(postID);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const upvotes = post.upvotes || [];
    const downvotes = post.downvotes || [];
    const hasUpvoted = upvotes.some((upvote) => upvote.equals(userObjectId));
    const hasDownvoted = downvotes.some((downvote) => downvote.equals(userObjectId));
    if (voteType === "upvote") {
        if (hasUpvoted) {
            yield post_model_1.default.updateOne({ _id: postID }, { $pull: { upvotes: userObjectId } });
        }
        else {
            if (hasDownvoted) {
                yield post_model_1.default.updateOne({ _id: postID }, { $pull: { downvotes: userObjectId } });
            }
            yield post_model_1.default.updateOne({ _id: postID }, { $push: { upvotes: userObjectId } });
        }
    }
    else if (voteType === "downvote") {
        if (hasDownvoted) {
            yield post_model_1.default.updateOne({ _id: postID }, { $pull: { downvotes: userObjectId } });
        }
        else {
            if (hasUpvoted) {
                yield post_model_1.default.updateOne({ _id: postID }, { $pull: { upvotes: userObjectId } });
            }
            yield post_model_1.default.updateOne({ _id: postID }, { $push: { downvotes: userObjectId } });
        }
    }
});
const getMypost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    const result = yield post_model_1.default.find({ author: objectId }).populate("author");
    return result;
});
exports.postServices = {
    createPostIntoDB,
    updatePostInDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
    deletePostFromDB,
    upvotesAndDownvotesFromDB,
    getMypost,
};
