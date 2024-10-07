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
exports.PaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.createPaymentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment Created Successfully",
        data: result,
    });
}));
const myPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield payment_service_1.PaymentServices.myPaymentHistroy((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "My Payment retrieved successfully",
        data: result,
    });
}));
const getSinglePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.params.id;
    const result = yield payment_service_1.PaymentServices.getSinglePaymentFromDB(paymentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment fetched successfully",
        data: result,
    });
}));
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_service_1.PaymentServices.getAllPaymentsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payments fetched successfully",
        data: payments,
    });
}));
const confirmationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, status, payload } = req.query;
    const result = yield payment_service_1.PaymentServices.confirmationService(transactionId, status, payload);
    res.send(result);
}));
// Uncomment and implement the updatePayment method if needed
// const updatePayment = catchAsync(async (req, res) => {
//   const paymentId = req.params.id;
//   const userId = req.user?.userId; // Assume you want to check the user
//
//   const result = await PaymentServices.updatePaymentInDB(paymentId, req.body, userId);
//
//   SendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Payment updated successfully",
//     data: result,
//   });
// });
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paymentId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield payment_service_1.PaymentServices.deletePaymentFromDB(paymentId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment deleted successfully",
        data: undefined,
    });
}));
exports.PaymentController = {
    createPayment,
    getSinglePayment,
    getAllPayments,
    myPayment,
    deletePayment,
    confirmationController,
};
