import express from "express";
import { DashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { User_Role } from "../../interface";
const router = express.Router();

router.get(
  "/get-myStats",
  auth(User_Role.admin, User_Role.user),
  DashboardController.dashbaordContent,
);

export const DashboardRoute = router;