import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CommentRoute } from "../modules/comment/comment.route";
import { PostRoutes } from "../modules/post/post.route";
import { PaymentRoute } from "../modules/payment/payment.route";
import { DashboardRoute } from "../modules/dashboard/dasboard.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/comment",
    route: CommentRoute,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
  {
    path: "/dashboard",
    route: DashboardRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
