import mongoose from "mongoose";
import { PaymentModel } from "../payment/payment.model";
import PostModel from "../post/post.model";
import { UserModel } from "../user/user.model";

const dashboardServices = async (userId: string, query: string) => {
  try {
    const findSingleUser = await UserModel.findOne({ _id: userId });

    if (findSingleUser?.role === "user") {
      if (query === "payments") {
        const paymentData = await PaymentModel.aggregate([
          {
            $match: { user: new mongoose.Types.ObjectId(userId) },
          },
          {
            $project: {
              amount: 1,
              status: 1,
              planTitle: 1,
            },
          },
        ]);

        return { paymentData };
      } else if (query === "posts") {
        const postData = await PostModel.aggregate([
          {
            $match: { author: new mongoose.Types.ObjectId(userId) },
          },
          {
            $project: {
              title: 1,
              upvotes: { $size: "$upvotes" },
              downvotes: { $size: "$downvotes" },
            },
          },
        ]);
        return { postData };
      }
      if (query === "total") {
        const paymentSummary = await PaymentModel.aggregate([
          {
            $match: { user: new mongoose.Types.ObjectId(userId) },
          },
          {
            $group: {
              _id: null,
              totalPayments: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ]);

        const postSummary = await PostModel.aggregate([
          {
            $match: { author: new mongoose.Types.ObjectId(userId) },
          },
          {
            $group: {
              _id: null,
              totalPosts: { $sum: 1 },
              totalUpvotes: { $sum: { $size: "$upvotes" } },
              totalDownvotes: { $sum: { $size: "$downvotes" } },
            },
          },
        ]);

        const dashboardData = {
          totalPayments: paymentSummary[0]?.totalPayments || 0,
          totalPaymentAmount: paymentSummary[0]?.totalAmount || 0,
          totalPosts: postSummary[0]?.totalPosts || 0,
          totalUpvotes: postSummary[0]?.totalUpvotes || 0,
          totalDownvotes: postSummary[0]?.totalDownvotes || 0,
        };

        return { dashboardData };
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    throw new Error("Failed to fetch dashboard data");
  }
};

export const DashboardServices = {
  dashboardServices,
};
