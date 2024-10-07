"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const user_utility_1 = require("./user.utility");
const config_1 = __importDefault(require("../../config"));
const sendEmail_1 = require("../../utils/sendEmail");
const mongoose_1 = require("mongoose");
const post_model_1 = __importDefault(require("../post/post.model"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({ email: payload.email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This email is Already Exists!!!");
    }
    const newUser = yield user_model_1.UserModel.create(payload);
    const result = yield user_model_1.UserModel.findById(newUser._id).select("-password");
    const jwtPayload = {
        userId: newUser === null || newUser === void 0 ? void 0 : newUser._id,
        username: newUser === null || newUser === void 0 ? void 0 : newUser.username,
        email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
        role: newUser === null || newUser === void 0 ? void 0 : newUser.role,
        gender: newUser === null || newUser === void 0 ? void 0 : newUser.gender,
        status: newUser === null || newUser === void 0 ? void 0 : newUser.status,
        profileImage: newUser === null || newUser === void 0 ? void 0 : newUser.profilePicture,
    };
    const accessToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Access_Token, config_1.default.Access_Token_Expires);
    const refreshToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Refresh_Token, config_1.default.Refresh_Token_Expires);
    return {
        accessToken,
        refreshToken,
        result,
    };
});
const getAllUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const checkAdmin = user.role === "admin";
    if (!checkAdmin) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not authorized!!!");
    }
    const result = yield user_model_1.UserModel.find();
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.UserModel.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found please Register!!!");
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        username: user === null || user === void 0 ? void 0 : user.username,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        status: user === null || user === void 0 ? void 0 : user.status,
        gender: user === null || user === void 0 ? void 0 : user.gender,
        profileImage: user === null || user === void 0 ? void 0 : user.profilePicture,
    };
    const accessToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Access_Token, config_1.default.Access_Token_Expires);
    const refreshToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Refresh_Token, config_1.default.Refresh_Token_Expires);
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Please enter valid password");
    }
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, user_utility_1.verifyToken)(refreshToken, config_1.default.Refresh_Token);
    const isUserExist = yield user_model_1.UserModel.findOne({ email: decoded === null || decoded === void 0 ? void 0 : decoded.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found. Please register");
    }
    const jwtPayload = {
        userId: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id,
        username: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.username,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
        gender: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.gender,
        status: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status,
        profileImage: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.profilePicture,
    };
    const accessToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Access_Token, config_1.default.Access_Token_Expires);
    return {
        accessToken,
    };
});
const getSingleUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId)
        .select("-password")
        .populate("favourite");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const updateSingleUserFromDB = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, username, bio, gardeningExperienceLevel, location, phone, dateOfBirth, profilePicture, interest, gender, facebook, twitter, instagram, linkedin, } = updateData;
    const socialMediaLinks = {
        facebook,
        twitter,
        instagram,
        linkedin,
    };
    const finalUpdateData = {
        _id,
        username,
        bio,
        gardeningExperienceLevel,
        location,
        phone,
        interests: interest,
        dateOfBirth,
        profilePicture,
        gender,
        socialMediaLinks,
    };
    const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, finalUpdateData, {
        new: true,
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        username: user === null || user === void 0 ? void 0 : user.username,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        gender: user === null || user === void 0 ? void 0 : user.gender,
        status: user === null || user === void 0 ? void 0 : user.status,
        profileImage: user === null || user === void 0 ? void 0 : user.profilePicture,
    };
    const accessToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Access_Token, config_1.default.Access_Token_Expires);
    return accessToken;
});
const deleteSingleUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userData.userId).select("password");
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Old password not matched");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.Bcrypt_Salt_Round));
    yield user_model_1.UserModel.findOneAndUpdate({
        _id: userData === null || userData === void 0 ? void 0 : userData.userId,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email: email });
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        username: user === null || user === void 0 ? void 0 : user.username,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        status: user === null || user === void 0 ? void 0 : user.status,
        gender: user === null || user === void 0 ? void 0 : user.gender,
        profileImage: user === null || user === void 0 ? void 0 : user.profilePicture,
    };
    const resetToken = (0, user_utility_1.createToken)(jwtPayload, config_1.default.Access_Token, "10m");
    const resetUILink = `${config_1.default.Reset_pass_ui_link}/reset-password?id=${user === null || user === void 0 ? void 0 : user._id}&token=${resetToken}`;
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
    (0, sendEmail_1.SendEmail)(user === null || user === void 0 ? void 0 : user.email, emailHTML);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email: payload.email });
    const decoded = (0, user_utility_1.verifyToken)(token, config_1.default.Access_Token);
    const { email, role } = decoded;
    if (email !== payload.email) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden!");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.Bcrypt_Salt_Round));
    yield user_model_1.UserModel.findOneAndUpdate({
        _id: user === null || user === void 0 ? void 0 : user._id,
        role: role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
});
const followAndUnfollowUserIntoDB = (followerId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const followerObjectId = new mongoose_1.Types.ObjectId(followerId);
        const targetUserObjectId = new mongoose_1.Types.ObjectId(targetUserId);
        const follower = yield user_model_1.UserModel.findById(followerObjectId);
        const targetUser = yield user_model_1.UserModel.findById(targetUserObjectId);
        if (!follower || !targetUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        const isFollowing = (_b = (_a = follower === null || follower === void 0 ? void 0 : follower.followers) === null || _a === void 0 ? void 0 : _a.includes(targetUserObjectId)) !== null && _b !== void 0 ? _b : false;
        if (isFollowing) {
            yield user_model_1.UserModel.updateOne({ _id: followerObjectId }, { $pull: { followers: targetUserObjectId } });
            yield user_model_1.UserModel.updateOne({ _id: targetUserObjectId }, { $pull: { following: followerObjectId } });
        }
        else {
            yield user_model_1.UserModel.updateOne({ _id: followerObjectId }, { $push: { followers: targetUserObjectId } });
            yield user_model_1.UserModel.updateOne({ _id: targetUserObjectId }, { $push: { following: followerObjectId } });
        }
        return isFollowing ? "Unfollowed successfully" : "Followed successfully";
    }
    catch (error) {
        console.error("Error following/unfollowing user:", error);
        throw error;
    }
});
const favouritePost = (id, userOwnId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postId = new mongoose_1.Types.ObjectId(id);
    const userId = new mongoose_1.Types.ObjectId(userOwnId);
    const isPostExist = yield post_model_1.default.findById(postId);
    const isUserExist = yield user_model_1.UserModel.findById(userId);
    if (!isPostExist) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Not found");
    }
    const checkIsFavouriteExist = (_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.favourite) === null || _a === void 0 ? void 0 : _a.includes(postId);
    if (checkIsFavouriteExist) {
        yield user_model_1.UserModel.findOneAndUpdate({ _id: userId }, { $pull: { favourite: id } });
    }
    else {
        yield user_model_1.UserModel.findOneAndUpdate({ _id: userId }, { $push: { favourite: id } });
    }
});
const statusToggleFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.UserModel.findById(id);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const checkStatusOfUser = findUser.status;
    if (checkStatusOfUser === "Active") {
        yield user_model_1.UserModel.findByIdAndUpdate({ _id: id }, { status: "Blocked" });
    }
    else {
        yield user_model_1.UserModel.findByIdAndUpdate({ _id: id }, { status: "Active" });
    }
});
exports.UserServices = {
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
    statusToggleFromDB,
};
