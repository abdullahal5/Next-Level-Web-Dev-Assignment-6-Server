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
exports.updateExpiredPayments = exports.verifyPayment = exports.initiatePayment = exports.generateUniqueId = void 0;
exports.calculateExpiryDate = calculateExpiryDate;
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const payment_model_1 = require("./payment.model");
const user_model_1 = require("../user/user.model");
const generateUniqueId = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now();
    const generateRandomString = (length) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };
    const randomString = generateRandomString(6);
    const uniqueId = `Fa-${year}${month}-${timestamp}-${randomString}`;
    return uniqueId;
});
exports.generateUniqueId = generateUniqueId;
const initiatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const response = yield axios_1.default.post(config_1.default.PAYMENT_URL, {
        store_id: config_1.default.Store_id,
        signature_key: config_1.default.SIGNETURE_KEY,
        tran_id: payload.transactionId,
        success_url: `${config_1.default.Backend_URL}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=success&payload=${encodeURIComponent(JSON.stringify(payload))}`,
        fail_url: `${config_1.default.Backend_URL}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=failed`,
        cancel_url: `${config_1.default.FrontEnd_URL}`,
        amount: payload.price,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: (_a = payload === null || payload === void 0 ? void 0 : payload.isUserExist) === null || _a === void 0 ? void 0 : _a.username,
        cus_email: (_b = payload.isUserExist) === null || _b === void 0 ? void 0 : _b.email,
        cus_add1: (_c = payload.isUserExist) === null || _c === void 0 ? void 0 : _c.location,
        cus_add2: (_d = payload.isUserExist) === null || _d === void 0 ? void 0 : _d.location,
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1206",
        cus_country: "Bangladesh",
        cus_phone: (_e = payload.isUserExist) === null || _e === void 0 ? void 0 : _e.phone,
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (tnxId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(config_1.default.VERIFY_URL, {
            params: {
                store_id: config_1.default.Store_id,
                signature_key: config_1.default.SIGNETURE_KEY,
                type: "json",
                request_id: tnxId,
            },
        });
        return response.data;
    }
    catch (err) {
        throw new Error("Payment validation failed!");
    }
});
exports.verifyPayment = verifyPayment;
function calculateExpiryDate(expiry) {
    const currentDate = new Date();
    if (expiry === "7 Days") {
        return new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    else if (expiry === "1 Day") {
        return new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
    }
    else if (expiry === "1 Month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        return currentDate.toISOString();
    }
    else {
        return expiry;
    }
}
const updateExpiredPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const expiredPayments = yield payment_model_1.PaymentModel.find({
        expiryDate: { $lt: currentDate },
        status: "Active",
    }).populate("user");
    yield Promise.all(expiredPayments.map((payment) => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.UserModel.findByIdAndUpdate({ _id: payment.user._id }, { isVerified: false });
        yield payment_model_1.PaymentModel.findByIdAndUpdate({ _id: payment._id }, { status: "Expired" });
    })));
});
exports.updateExpiredPayments = updateExpiredPayments;
