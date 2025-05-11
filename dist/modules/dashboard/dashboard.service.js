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
const mongoose_1 = __importDefault(require("mongoose"));
const payment_model_1 = require("../payment/payment.model");
const post_model_1 = __importDefault(require("../post/post.model"));
const user_model_1 = require("../user/user.model");
const dashboardServices = (userId, p0) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const findSingleUser = yield user_model_1.UserModel.findOne({ _id: userId });
        if (!findSingleUser) {
            throw new Error("User not found");
        }
        if ((findSingleUser === null || findSingleUser === void 0 ? void 0 : findSingleUser.role) === "user") {
            const totalPosts = yield post_model_1.default.countDocuments({ author: userId });
            const totalFollowers = ((_a = findSingleUser.followers) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const totalFollowing = ((_b = findSingleUser.following) === null || _b === void 0 ? void 0 : _b.length) || 0;
            const payments = yield payment_model_1.PaymentModel.aggregate([
                { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
                { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
            ]);
            const totalPayAmount = ((_c = payments[0]) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0;
            return { totalPosts, totalFollowers, totalFollowing, totalPayAmount };
        }
        else if ((findSingleUser === null || findSingleUser === void 0 ? void 0 : findSingleUser.role) === "admin") {
            // For admin, return aggregated data for all users
            const totalPosts = yield post_model_1.default.countDocuments();
            const totalUsers = yield user_model_1.UserModel.countDocuments();
            const payments = yield payment_model_1.PaymentModel.aggregate([
                { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
            ]);
            const totalPayAmount = ((_d = payments[0]) === null || _d === void 0 ? void 0 : _d.totalAmount) || 0;
            return { totalPosts, totalUsers, totalPayAmount };
        }
        else {
            throw new Error("User role is not recognized");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        throw new Error("Failed to fetch dashboard data");
    }
});
exports.DashboardServices = {
    dashboardServices,
};
