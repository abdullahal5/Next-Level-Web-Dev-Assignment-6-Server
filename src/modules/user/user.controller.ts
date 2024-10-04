import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { IUser } from "./user.interface";
import AppError from "../../errors/AppError";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUserIntoDB(req.body);
  const { refreshToken, accessToken, result } = user;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: { result, accessToken },
  });
});

const userLogin = catchAsync(async (req, res) => {
  const user = await UserServices.loginUser(req.body);
  const { refreshToken, accessToken } = user;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged in Successfully",
    data: {
      accessToken,
    },
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const user: IUser | undefined = req.user as IUser;

  if (!user || !user.role) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User not authorized or missing role.",
    );
  }

  const result = await UserServices.getAllUser(user);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All user retrieved succesfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const updateSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.updateSingleUserFromDB(
    req.params.id,
    req.body,
  );

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: user,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.deleteSingleUserFromDB(req.params.id);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Deleted Successfully",
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await UserServices.changePassword(
    req?.user as JwtPayload,
    passwordData,
  );

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed!!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await UserServices.forgetPassword(email);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP Send to your email!!!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] as string;

  const result = await UserServices.resetPassword(req.body, token);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfull",
    data: result,
  });
});

const followAndUnfollowUser = catchAsync(async (req, res) => {
  const user = await UserServices.followAndUnfollowUserIntoDB(
    req.body.id,
    req?.user?.userId,
  );

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followed Successfully",
    data: user,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUser,
  updateSingleUser,
  deleteSingleUser,
  userLogin,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
  followAndUnfollowUser,
};
