import express from "express";
import { PaymentController } from "./payment.controller";
const router = express.Router();

router.post(
  "/create",
  PaymentController.createPayment,
);

router.post(
  "/confirmation",
  PaymentController.confirmationController,
);

// router.get("/get-all", CommentController.getAllComments);

// router.get("/get-single/:id", CommentController.getSingleComment);
// router.delete(
//   "/delete/:id",
//   auth(User_Role.user, User_Role.admin),
//   CommentController.deleteComment,
// );

export const PaymentRoute = router;
