"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const interface_1 = require("../../interface");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/create", payment_controller_1.PaymentController.createPayment);
router.post("/confirmation", payment_controller_1.PaymentController.confirmationController);
router.get("/get-myPaymentHistory", (0, auth_1.default)(interface_1.User_Role.admin, interface_1.User_Role.user), payment_controller_1.PaymentController.myPayment);
// router.get("/get-single/:id", CommentController.getSingleComment);
// router.delete(
//   "/delete/:id",
//   auth(User_Role.user, User_Role.admin),
//   CommentController.deleteComment,
// );
exports.PaymentRoute = router;
