import { z } from "zod";
import mongoose from "mongoose";

const PostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    bio: z.string({
      required_error: "Bio is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    author: z.string({
      required_error: "Author ID is required",
    }),
    comments: z.array(z.instanceof(mongoose.Types.ObjectId)).optional(),
    tags: z.array(z.string()).default([]),
    category: z.string({
      required_error: "Category is required",
    }),
    upvotes: z.number().default(0),
    downvotes: z.number().default(0),
    commentsCount: z.number().default(0),
    isPremium: z.boolean().default(false),
    images: z.array(z.string()).default([]),
  }),
});

export const PostValidation = {
  PostValidationSchema,
};
