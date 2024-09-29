import mongoose, { Model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  passwordChangedAt: Date;
  username: string;
  role: "user" | "admin";
  profilePicture?: string;
  bio?: string;
  followers?: mongoose.Types.ObjectId[];
  following?: mongoose.Types.ObjectId[];
  isVerified: boolean;
  verificationBadge?: string;
  dateOfBirth?: Date;
  location?: string;
  gender?: "Male" | "Female" | "Other";
  gardeningExperienceLevel?: "Beginner" | "Intermediate" | "Expert";
  phone?: string;
  interests?: string[];
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface ILoginInfo {
  email: string;
  password: string;
}

export interface JwtpayloadData {
  userId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  role: string;
  gender: string | undefined;
  profileImage: string | undefined;
}

export interface IUserModel extends Model<IUser> {
  isUserExistsByCustomId(id: string): Promise<IUser>;
  isPasswordMatched(
    planeTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}