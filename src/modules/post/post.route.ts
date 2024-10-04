import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./post.validation";
import { PostController } from "./post.controller";
const router = express.Router();

router.post(
  "/create",
  validateRequest(PostValidation.PostValidationSchema),
  PostController.createPost,
);

router.get("/get-all", PostController.getAllPosts);
router.get("/get-single/:id", PostController.getSinglePost);
router.put("/delete", PostController.updatePost);
router.delete("/delete", PostController.deletePost);

export const PostRoutes = router;
