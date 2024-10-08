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
const getAllPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find().populate("author comments");
    return result;
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
const upvotesAndDownvotesFromDB = (postID, voteType) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistPost = yield post_model_1.default.findById(postID);
    if (!isExistPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Not found");
    }
    if (voteType === "increment") {
        yield post_model_1.default.updateOne({ _id: postID }, { $inc: { upvotes: 1 } });
    }
    else {
        yield post_model_1.default.updateOne({ _id: postID }, { $inc: { downvotes: 1 } });
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
