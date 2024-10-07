"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const commentSchema = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Post ID is required",
        }),
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        commentText: zod_1.z.string({
            required_error: "Comment text is required",
        }),
    }),
});
exports.CommentValidation = {
    commentSchema,
};
