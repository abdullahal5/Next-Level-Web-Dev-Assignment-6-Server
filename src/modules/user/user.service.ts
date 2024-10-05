import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "./user.model";
import { ILoginInfo, IUser, JwtpayloadData } from "./user.interface";
import { createToken, verifyToken } from "./user.utility";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { SendEmail } from "../../utils/sendEmail";
import { Types } from "mongoose";
import PostModel from "../post/post.model";

const createUserIntoDB = async (payload: IUser) => {
  const isUserExists = await UserModel.findOne({ email: payload.email });

  if (isUserExists) {
    throw new AppError(httpStatus.FORBIDDEN, "This email is Already Exists!!!");
  }

  const newUser = await UserModel.create(payload);

  const result = await UserModel.findById(newUser._id).select("-password");

  const jwtPayload: JwtpayloadData = {
    userId: newUser?._id,
    username: newUser?.username,
    email: newUser?.email,
    role: newUser?.role,
    gender: newUser?.gender,
    status: newUser?.status,
    profileImage: newUser?.profilePicture,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Access_Token as string,
    config.Access_Token_Expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.Refresh_Token as string,
    config.Refresh_Token_Expires as string,
  );

  return {
    accessToken,
    refreshToken,
    result,
  };
};

const getAllUser = async (user: { role: string }) => {
  const checkAdmin = user.role === "admin";

  if (!checkAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, "User not authorized!!!");
  }

  const result = await UserModel.find();

  return result;
};

const loginUser = async (payload: ILoginInfo) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found please Register!!!",
    );
  }

  const jwtPayload: JwtpayloadData = {
    userId: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    status: user?.status,
    gender: user?.gender,
    profileImage: user?.profilePicture,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Access_Token as string,
    config.Access_Token_Expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.Refresh_Token as string,
    config.Refresh_Token_Expires as string,
  );

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Please enter valid password");
  }

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, config.Refresh_Token as string);

  const isUserExist = await UserModel.findOne({ email: decoded?.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found. Please register");
  }

  const jwtPayload: JwtpayloadData = {
    userId: isUserExist?._id,
    username: isUserExist?.username,
    email: isUserExist?.email,
    role: isUserExist?.role,
    gender: isUserExist?.gender,
    status: isUserExist?.status,
    profileImage: isUserExist?.profilePicture,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Access_Token as string,
    config.Access_Token_Expires as string,
  );

  return {
    accessToken,
  };
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .select("-password")
    .populate("favourite");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateSingleUserFromDB = async (
  userId: string,
  updateData: Partial<IUser>,
) => {
  const user = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const deleteSingleUserFromDB = async (userId: string) => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await UserModel.findById(userData.userId).select("password");

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password not matched");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.Bcrypt_Salt_Round),
  );

  await UserModel.findOneAndUpdate(
    {
      _id: userData?.userId,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

const forgetPassword = async (email: string) => {
  const user = await UserModel.findOne({ email: email });

  const jwtPayload = {
    userId: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    status: user?.status,
    gender: user?.gender,
    profileImage: user?.profilePicture,
  };

  const resetToken = createToken(
    jwtPayload,
    config.Access_Token as string,
    "10m",
  );

  const resetUILink = `${config.Reset_pass_ui_link}/reset-password?id=${user?._id}&token=${resetToken}`;

  const emailHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUILink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease, transform 0.3s ease;" onmousedown="this.style.backgroundColor='#0056b3'; this.style.transform='scale(0.95)';" onmouseup="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';" onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';">
        Reset Password
      </a>
      <p>This link will expire in 10 minutes.</p>
    </div>
  `;

  SendEmail(user?.email as string, emailHTML);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await UserModel.findOne({ email: payload.email });

  const decoded = verifyToken(token, config.Access_Token as string);

  const { email, role } = decoded;

  if (email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.Bcrypt_Salt_Round),
  );

  await UserModel.findOneAndUpdate(
    {
      _id: user?._id,
      role: role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

const followAndUnfollowUserIntoDB = async (
  followerId: string,
  targetUserId: string,
) => {
  try {
    const followerObjectId = new Types.ObjectId(followerId);
    const targetUserObjectId = new Types.ObjectId(targetUserId);

    const follower = await UserModel.findById(followerObjectId);
    const targetUser = await UserModel.findById(targetUserObjectId);

    if (!follower || !targetUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isFollowing =
      follower?.followers?.includes(targetUserObjectId) ?? false;

    if (isFollowing) {
      await UserModel.updateOne(
        { _id: followerObjectId },
        { $pull: { followers: targetUserObjectId } },
      );

      await UserModel.updateOne(
        { _id: targetUserObjectId },
        { $pull: { following: followerObjectId } },
      );
    } else {
      await UserModel.updateOne(
        { _id: followerObjectId },
        { $push: { followers: targetUserObjectId } },
      );
      await UserModel.updateOne(
        { _id: targetUserObjectId },
        { $push: { following: followerObjectId } },
      );
    }

    return isFollowing ? "Unfollowed successfully" : "Followed successfully";
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    throw error;
  }
};

const favouritePost = async (id: string, userOwnId: string) => {
  const postId = new Types.ObjectId(id);
  const userId = new Types.ObjectId(userOwnId);

  const isPostExist = await PostModel.findById(postId);
  const isUserExist = await UserModel.findById(userId);

  if (!isPostExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Not found");
  }

  const checkIsFavouriteExist = isUserExist?.favourite?.includes(postId);

  if (checkIsFavouriteExist) {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { favourite: id } },
    );
  } else {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { favourite: id } },
    );
  }
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  refreshToken,
  getAllUser,
  getSingleUserFromDB,
  updateSingleUserFromDB,
  deleteSingleUserFromDB,
  changePassword,
  forgetPassword,
  resetPassword,
  followAndUnfollowUserIntoDB,
  favouritePost,
};
