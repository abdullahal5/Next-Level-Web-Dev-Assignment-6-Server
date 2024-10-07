"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const AppError_1 = __importDefault(require("../../errors/AppError"));
const payment_model_1 = require("./payment.model");
const http_status_1 = __importDefault(require("http-status"));
const payment_utils_1 = require("./payment.utils");
const user_model_1 = require("../user/user.model");
const path_1 = require("path");
const fs_1 = require("fs");
const createPaymentIntoDB = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.UserModel.findById(body.user);
    const newId = yield (0, payment_utils_1.generateUniqueId)();
    if (isUserExist && newId) {
        const paymentData = Object.assign(Object.assign({}, body), { transactionId: newId, isUserExist });
        const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
        return paymentSession;
    }
});
const getAllPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_model_1.PaymentModel.find().populate("user");
    return payments;
});
const myPaymentHistroy = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_model_1.PaymentModel.find({ user: id }).populate("user");
    return payments;
});
const getSinglePaymentFromDB = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.PaymentModel.findById(paymentId);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
const deletePaymentFromDB = (paymentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.PaymentModel.findById(paymentId);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    const checkIsUser = payment.user.toString() === userId.toString();
    if (!checkIsUser) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Forbidden");
    }
    yield payment_model_1.PaymentModel.findByIdAndDelete(paymentId);
    return payment;
});
const confirmationService = (transactionId, status, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let message = "";
    let parsedPayload;
    try {
        const res = yield (0, payment_utils_1.verifyPayment)(transactionId);
        try {
            parsedPayload = JSON.parse(payload || "{}");
        }
        catch (error) {
            throw new Error("Invalid JSON format in payload");
        }
        if (!parsedPayload.user ||
            !parsedPayload.price ||
            !parsedPayload.transactionId ||
            !parsedPayload.title ||
            !parsedPayload.expiry) {
            throw new Error("Missing required payment data fields.");
        }
        const paymentDataPayload = parsedPayload;
        const paymentData = {
            user: paymentDataPayload.user,
            amount: Number(paymentDataPayload.price),
            status: res && res.pay_status === "Successful" ? "Active" : "Expired",
            transactionId: paymentDataPayload.transactionId,
            planTitle: paymentDataPayload.title,
            planPrice: Number(paymentDataPayload.price),
            expiryDate: (0, payment_utils_1.calculateExpiryDate)(paymentDataPayload.expiry),
        };
        if (isNaN(paymentData.amount) || isNaN(paymentData.planPrice)) {
            throw new Error("Invalid price data: amount or planPrice is NaN.");
        }
        if (res && res.pay_status === "Successful") {
            yield user_model_1.UserModel.findByIdAndUpdate({ _id: paymentData.user }, { isVerified: true });
            yield payment_model_1.PaymentModel.create(paymentData);
            message = "Payment successful";
            const filePath = (0, path_1.join)(__dirname, "../../../views/confirmation.html");
            let template = (0, fs_1.readFileSync)(filePath, "utf-8");
            template = template.replace("{{message}}", message);
            return template;
        }
        else {
            throw new Error("Payment validation failed.");
        }
    }
    catch (error) {
        message = "Payment failed";
        const filePath = (0, path_1.join)(__dirname, "../../../views/failConfirmation.html");
        let template;
        try {
            template = (0, fs_1.readFileSync)(filePath, "utf-8");
        }
        catch (fileError) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to load failConfirmation template");
        }
        template = template.replace("{{message}}", message);
        return template;
    }
});
// Uncomment if you need to implement update functionality
// const updatePaymentInDB = async (paymentId: string, updateBody: Partial<IPayment>, userId: string) => {
//   const payment = await PaymentModel.findById(paymentId);
//   if (!payment) {
//     throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
//   }
//   const checkIsUser = payment.user.toString() === userId.toString();
//   if (!checkIsUser) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Forbidden");
//   }
//   const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentId, updateBody, {
//     new: true,
//     runValidators: true,
//   });
//   return updatedPayment;
// };
exports.PaymentServices = {
    createPaymentIntoDB,
    getAllPaymentsFromDB,
    getSinglePaymentFromDB,
    deletePaymentFromDB,
    confirmationService,
    myPaymentHistroy,
};
