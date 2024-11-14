import mongoose, { model, Schema } from "mongoose";
import { IUser, IUserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^([\w.-]+@[\w-]+\.[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "https://i.ibb.co/vkVW6s0/download.png",
    },
    bio: {
      type: String,
      maxlength: 101,
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    favourite: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    gardeningExperienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    interests: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active"
    },
    socialMediaLinks: {
      facebook: {
        type: String,
        required: false,
      },
      twitter: {
        type: String,
        required: false,
      },
      instagram: {
        type: String,
        required: false,
      },
      linkedin: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.Bcrypt_Salt_Round),
  );
  next();
});

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const UserModel = model<IUser, IUserModel>("User", UserSchema);
