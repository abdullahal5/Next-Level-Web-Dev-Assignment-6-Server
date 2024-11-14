"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .email({ message: "Please provide a valid email address." }),
        password: zod_1.z.string(),
        // passwordChangedAt: z.date(),
        username: zod_1.z.string(),
        role: zod_1.z
            .enum(["user", "admin"], {
            required_error: "Role is required.",
        })
            .optional(),
        profilePicture: zod_1.z.string().optional(),
        bio: zod_1.z
            .string()
            .max(101, { message: "Bio must be at most 101 characters long." })
            .optional(),
        followers: zod_1.z
            .array(zod_1.z.instanceof(mongoose_1.default.Types.ObjectId))
            .optional()
            .default([]),
        following: zod_1.z
            .array(zod_1.z.instanceof(mongoose_1.default.Types.ObjectId))
            .optional()
            .default([]),
        favourite: zod_1.z
            .array(zod_1.z.instanceof(mongoose_1.default.Types.ObjectId))
            .optional()
            .default([]),
        isVerified: zod_1.z.boolean().default(false),
        dateOfBirth: zod_1.z.string(),
        location: zod_1.z.string().optional(),
        gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
        status: zod_1.z.enum(["Active", "Blocked"]).optional(),
        gardeningExperienceLevel: zod_1.z
            .enum(["Beginner", "Intermediate", "Expert"])
            .optional(),
        interests: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        socialMediaLinks: zod_1.z
            .object({
            facebook: zod_1.z.string().optional(),
            twitter: zod_1.z.string().optional(),
            instagram: zod_1.z.string().optional(),
            linkedin: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
const loginUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: "Old password is required!",
        }),
        newPassword: zod_1.z.string({
            required_error: "New password is required!",
        }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "User id is required!",
        }),
    }),
});
exports.UserValidation = {
    createUserSchema,
    loginUserValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
};
