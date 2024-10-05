import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CommentValidation } from "./comment.validation";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { User_Role } from "../../interface";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CommentValidation.commentSchema),
  CommentController.createComment,
);

router.get("/get-all", CommentController.getAllComments);

router.get("/get-single/:id", CommentController.getSingleComment);
router.delete(
  "/delete/:id",
  auth(User_Role.user, User_Role.admin),
  CommentController.deleteComment,
);

export const CommentRoute = router;
