"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const PostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        bio: zod_1.z.string({
            required_error: "Bio is required",
        }),
        content: zod_1.z.string({
            required_error: "Content is required",
        }),
        author: zod_1.z.string({
            required_error: "Author ID is required",
        }),
        comments: zod_1.z.array(zod_1.z.instanceof(mongoose_1.default.Types.ObjectId)).optional(),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        upvotes: zod_1.z.number().default(0),
        downvotes: zod_1.z.number().default(0),
        commentsCount: zod_1.z.number().default(0),
        isPremium: zod_1.z.boolean().default(false),
        images: zod_1.z.array(zod_1.z.string()).default([]),
    }),
});
exports.PostValidation = {
    PostValidationSchema,
};
