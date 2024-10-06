import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntoDB(req.body);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Created Successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.id;
  const result = await PaymentServices.getSinglePaymentFromDB(paymentId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const payments = await PaymentServices.getAllPaymentsFromDB();

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments fetched successfully",
    data: payments,
  });
});

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;
  const result = await PaymentServices.confirmationService(
    transactionId as string,
    status as string,
  );

  res.send(result);
});

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

const deletePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.id;
  const userId = req.user?.userId;

  await PaymentServices.deletePaymentFromDB(paymentId, userId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment deleted successfully",
    data: undefined,
  });
});

export const PaymentController = {
  createPayment,
  getSinglePayment,
  getAllPayments,
  // updatePayment, // Uncomment if implemented
  deletePayment,
  confirmationController,
};
