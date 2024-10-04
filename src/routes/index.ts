import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CommentRoute } from "../modules/comment/comment.route";
import { PostRoutes } from "../modules/post/post.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
