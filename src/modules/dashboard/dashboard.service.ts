import mongoose from "mongoose";
import { PaymentModel } from "../payment/payment.model";
import PostModel from "../post/post.model";
import { UserModel } from "../user/user.model";

const dashboardServices = async (userId: string, p0: string) => {
  try {
    const findSingleUser = await UserModel.findOne({ _id: userId });

    if (!findSingleUser) {
      throw new Error("User not found");
    }

    if (findSingleUser?.role === "user") {
      const totalPosts = await PostModel.countDocuments({ author: userId });
      const totalFollowers = findSingleUser.followers?.length || 0;
      const totalFollowing = findSingleUser.following?.length || 0;

      const payments = await PaymentModel.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      const totalPayAmount = payments[0]?.totalAmount || 0;

      return { totalPosts, totalFollowers, totalFollowing, totalPayAmount };
    } else if (findSingleUser?.role === "admin") {
      // For admin, return aggregated data for all users
      const totalPosts = await PostModel.countDocuments();
      const totalUsers = await UserModel.countDocuments();

      const payments = await PaymentModel.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      const totalPayAmount = payments[0]?.totalAmount || 0;

      return { totalPosts, totalUsers, totalPayAmount };
    } else {
      throw new Error("User role is not recognized");
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    throw new Error("Failed to fetch dashboard data");
  }
};

export const DashboardServices = {
  dashboardServices,
};
