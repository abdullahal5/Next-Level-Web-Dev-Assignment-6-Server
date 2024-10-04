import { z } from "zod";

const commentSchema = z.object({
  postId: z.string({
    required_error: "Post ID is required",
  }),
  userId: z.string({
    required_error: "User ID is required",
  }),
  username: z.string({
    required_error: "Username is required",
  }),
  profileImage: z.string().optional(),
  commentText: z.string({
    required_error: "Comment text is required",
  }),
  upvotes: z.number().default(0).optional(),
  downvotes: z.number().default(0).optional(),
});

export const CommentValidation = {
  commentSchema
};
