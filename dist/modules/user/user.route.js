"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const interface_1 = require("../../interface");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserSchema), user_controller_1.UserControllers.userRegister);
router.post("/login", (0, validateRequest_1.default)(user_validation_1.UserValidation.loginUserValidationSchema), user_controller_1.UserControllers.userLogin);
router.post("/refresh-token", user_controller_1.UserControllers.refreshToken);
router.get("/get-all-user", (0, auth_1.default)(interface_1.User_Role.admin), user_controller_1.UserControllers.getAllUser);
router.get("/get-single-user/:id", (0, auth_1.default)(interface_1.User_Role.user, interface_1.User_Role.admin), user_controller_1.UserControllers.getSingleUser);
router.put("/update-single-user/:id", (0, auth_1.default)(interface_1.User_Role.user, interface_1.User_Role.admin), user_controller_1.UserControllers.updateSingleUser);
router.delete("/delete-single-user/:id", (0, auth_1.default)(interface_1.User_Role.admin), user_controller_1.UserControllers.deleteSingleUser);
router.post("/change-password", (0, validateRequest_1.default)(user_validation_1.UserValidation.changePasswordValidationSchema), (0, auth_1.default)(interface_1.User_Role.admin, interface_1.User_Role.user), user_controller_1.UserControllers.changePassword);
router.post("/forget-password", (0, validateRequest_1.default)(user_validation_1.UserValidation.forgetPasswordValidationSchema), user_controller_1.UserControllers.forgetPassword);
router.post("/reset-password", (0, validateRequest_1.default)(user_validation_1.UserValidation.forgetPasswordValidationSchema), user_controller_1.UserControllers.resetPassword);
router.put("/followunfollow", (0, auth_1.default)(interface_1.User_Role.admin, interface_1.User_Role.user), user_controller_1.UserControllers.followAndUnfollowUser);
router.put("/favourite-toggle", (0, auth_1.default)(interface_1.User_Role.admin, interface_1.User_Role.user), user_controller_1.UserControllers.favouritePost);
router.put("/status-toggle/:id", (0, auth_1.default)(interface_1.User_Role.admin), user_controller_1.UserControllers.toggleStatus);
exports.UserRoutes = router;
