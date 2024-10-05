import { z } from "zod";

const commentSchema = z.object({
  body: z.object({
    postId: z.string({
      required_error: "Post ID is required",
    }),
    userId: z.string({
      required_error: "User ID is required",
    }),
    commentText: z.string({
      required_error: "Comment text is required",
    }),
  }),
});

export const CommentValidation = {
  commentSchema,
};
