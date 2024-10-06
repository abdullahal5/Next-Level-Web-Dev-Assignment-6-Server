import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./post.validation";
import { PostController } from "./post.controller";
import { User_Role } from "../../interface";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/create",
  validateRequest(PostValidation.PostValidationSchema),
  PostController.createPost,
);

router.get("/get-all", PostController.getAllPosts);
router.get("/get-single/:id", PostController.getSinglePost);
router.put("/update", PostController.updatePost);
router.put("/upvoteDownvote/:id", PostController.upvoteAndDownvote);
router.delete("/delete/:id", auth(User_Role.admin), PostController.deletePost);

export const PostRoutes = router;
