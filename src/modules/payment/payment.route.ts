import express from "express";
import { PaymentController } from "./payment.controller";
import { User_Role } from "../../interface";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/create", PaymentController.createPayment);

router.post("/confirmation", PaymentController.confirmationController);

router.get(
  "/get-myPaymentHistory",
  auth(User_Role.admin, User_Role.user),
  PaymentController.myPayment,
);

// router.get("/get-single/:id", CommentController.getSingleComment);
// router.delete(
//   "/delete/:id",
//   auth(User_Role.user, User_Role.admin),
//   CommentController.deleteComment,
// );

export const PaymentRoute = router;
