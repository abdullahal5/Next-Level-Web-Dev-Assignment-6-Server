import { PaymentModel } from "../payment/payment.model";
import PostModel from "../post/post.model";
import { UserModel } from "../user/user.model";

const dashboardServices = async (id: string) => {
  const user = await UserModel.findById(id);

  if (user?.role === "user") {
    const userPostsCount = await PostModel.countDocuments({ userId: id });
    const followerCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;

    return {
      postCount: userPostsCount,
      followers: followerCount,
      following: followingCount,
    };
  } else if (user?.role === "admin") {
    const totalPostsCount = await PostModel.countDocuments();
    const totalUsersCount = await UserModel.countDocuments();
    const totalRevenue = await PaymentModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    return {
      totalPosts: totalPostsCount,
      totalUsers: totalUsersCount,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    };
  }

  return null;
};

export const DashboardServices = {
  dashboardServices,
};
