import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CommentValidation } from "./comment.validation";
import { CommentController } from "./comment.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CommentValidation.commentSchema),
  CommentController.createComment,
);

router.get("/get-all", CommentController.getAllComments);

router.get("/get-single/:id", CommentController.getSingleComment);

export const CommentRoute = router;
