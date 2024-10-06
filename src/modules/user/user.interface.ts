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
  favourite?: mongoose.Types.ObjectId[];
  isVerified: boolean;
  dateOfBirth?: Date;
  location?: string;
  gender?: "Male" | "Female" | "Other";
  gardeningExperienceLevel?: "Beginner" | "Intermediate" | "Expert";
  phone?: string;
  interests?: string;
  status?: "Active" | "Blocked";
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
  status: string | undefined;
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

interface ISocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface IUserEditProfile {
  _id: string;
  username: string;
  bio: string;
  gardeningExperienceLevel: string;
  location: string;
  dateOfBirth: string
  profilePicture: string
  phone: string;
  interest: string;
  gender: string;
  socialMediaLinks?: ISocialMediaLinks;
}
