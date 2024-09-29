import mongoose from "mongoose";
import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    password: z.string(),
    // passwordChangedAt: z.date(),
    username: z.string(),
    role: z.enum(["user", "admin"], {
      required_error: "Role is required.",
    }),
    profilePicture: z.string().optional(),
    bio: z
      .string()
      .max(101, { message: "Bio must be at most 101 characters long." })
      .optional(),
    followers: z
      .array(z.instanceof(mongoose.Types.ObjectId))
      .optional()
      .default([]),
    following: z
      .array(z.instanceof(mongoose.Types.ObjectId))
      .optional()
      .default([]),
    isVerified: z.boolean().default(false),
    verificationBadge: z.string().optional(),
    dateOfBirth: z.date().optional(),
    location: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    gardeningExperienceLevel: z
      .enum(["Beginner", "Intermediate", "Expert"])
      .optional(),
    interests: z.array(z.string()).optional().default([]),
    phone: z.string().optional(),
    socialMediaLinks: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required!",
    }),
    newPassword: z.string({
      required_error: "New password is required!",
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "User id is required!"
    })
  })
})

export const UserValidation = {
  createUserSchema,
  loginUserValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema
};
