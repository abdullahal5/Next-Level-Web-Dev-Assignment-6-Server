/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errors/AppError";
import { IPayment, PaymentData } from "./payment.interface";
import { PaymentModel } from "./payment.model";
import httpStatus from "http-status";
import {
  generateUniqueId,
  initiatePayment,
  verifyPayment,
} from "./payment.utils";
import { UserModel } from "../user/user.model";
import { join } from "path";
import { readFileSync } from "fs";

const createPaymentIntoDB = async (body: IPayment) => {
  const isUserExist = await UserModel.findById(body.user);

  const newId = await generateUniqueId();
  if (isUserExist && newId) {
    const paymentData: PaymentData = {
      ...body,
      transactionId: newId,
      isUserExist,
    };

    const paymentSession = await initiatePayment(paymentData);
    return paymentSession;
  }
};

const getAllPaymentsFromDB = async () => {
  const payments = await PaymentModel.find().populate("user");
  return payments;
};

const getSinglePaymentFromDB = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};

const deletePaymentFromDB = async (paymentId: string, userId: string) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  const checkIsUser = payment.user.toString() === userId.toString();
  if (!checkIsUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Forbidden");
  }

  await PaymentModel.findByIdAndDelete(paymentId);
  return payment;
};

const confirmationService = async (
  transactionId?: string | undefined,
  payload?: string | undefined,
) => {
  // console.log(transactionId)
  const res = await verifyPayment(transactionId);

  let result;
  let message = "";

  if (res && res.pay_status === "Successful") {
    message = "Payment successful";

    const filePath = join(__dirname, "../../../views/confirmation.html");
    let template = readFileSync(filePath, "utf-8");

    template = template.replace("{{message}}", message);

    return template;
  } else {
    const message = "Payment failed";
    const filePath = join(__dirname, "../../../views/failConfirmation.html");

    let template;
    try {
      template = readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to load failConfirmation template",
      );
    }

    template = template.replace("{{message}}", message);
    return template;
  }

  // if (res && res.pay_status === "Successful") {

  //   message = "Payment successful";

  //   const filePath = join(__dirname, "../../../views/confirmation.html");
  //   let template = readFileSync(filePath, "utf-8");

  //   template = template.replace("{{message}}", message);

  //   return template;
  // } else {
  //   const message = "Payment failed";
  //   const filePath = join(__dirname, "../../../views/failConfirmation.html");

  //   let template;
  //   try {
  //     template = readFileSync(filePath, "utf-8");
  //   } catch (error) {
  //     throw new AppError(
  //       httpStatus.INTERNAL_SERVER_ERROR,
  //       "Failed to load failConfirmation template",
  //     );
  //   }

  //   template = template.replace("{{message}}", message);
  //   return template;
  // }
};

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

export const PaymentServices = {
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
  deletePaymentFromDB,
  confirmationService,
  // updatePaymentInDB, // Uncomment if needed
};
