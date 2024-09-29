import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { User_Role } from "../../interface";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.createUserSchema),
  UserControllers.userRegister,
);

router.post(
  "/login",
  validateRequest(UserValidation.loginUserValidationSchema),
  UserControllers.userLogin,
);

router.post("/refresh-token", UserControllers.refreshToken);

router.get("/get-all-user", auth(User_Role.admin), UserControllers.getAllUser);

router.get(
  "/get-single-user/:id",
  auth(User_Role.admin),
  UserControllers.getSingleUser,
);

router.put(
  "/update-single-user/:id",
  auth(User_Role.admin),
  UserControllers.updateSingleUser,
);

router.delete(
  "/delete-single-user/:id",
  auth(User_Role.admin),
  UserControllers.deleteSingleUser,
);

router.post(
  "/change-password",
  validateRequest(UserValidation.changePasswordValidationSchema),
  auth(User_Role.admin, User_Role.user),
  UserControllers.changePassword,
);

router.post(
  "/forget-password",
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  UserControllers.forgetPassword,
);

router.post(
  "/reset-password",
  validateRequest(UserValidation.forgetPasswordValidationSchema),
  UserControllers.resetPassword,
);

export const UserRoutes = router;
