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
exports.DashboardServices = void 0;
const payment_model_1 = require("../payment/payment.model");
const post_model_1 = __importDefault(require("../post/post.model"));
const user_model_1 = require("../user/user.model");
const dashboardServices = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = yield user_model_1.UserModel.findById(id);
    if ((user === null || user === void 0 ? void 0 : user.role) === "user") {
        const userPostsCount = yield post_model_1.default.countDocuments({ userId: id });
        const followerCount = ((_a = user.followers) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const followingCount = ((_b = user.following) === null || _b === void 0 ? void 0 : _b.length) || 0;
        return {
            postCount: userPostsCount,
            followers: followerCount,
            following: followingCount,
        };
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
        const totalPostsCount = yield post_model_1.default.countDocuments();
        const totalUsersCount = yield user_model_1.UserModel.countDocuments();
        const totalRevenue = yield payment_model_1.PaymentModel.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);
        return {
            totalPosts: totalPostsCount,
            totalUsers: totalUsersCount,
            totalRevenue: ((_c = totalRevenue[0]) === null || _c === void 0 ? void 0 : _c.totalRevenue) || 0,
        };
    }
    return null;
});
exports.DashboardServices = {
    dashboardServices,
};
