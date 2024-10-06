/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import config from "../../config";
import { PaymentData } from "./payment.interface";

export const generateUniqueId = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const timestamp = Date.now();

  const generateRandomString = (length: number): string => {
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
};

export const initiatePayment = async (payload: PaymentData) => {
  const response = await axios.post(config.PAYMENT_URL!, {
    store_id: config.Store_id,
    signature_key: config.SIGNETURE_KEY,
    tran_id: payload.transactionId,
    success_url: `${config.Backend_URL}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=success`,
    fail_url: `${config.Backend_URL}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=failed`,
    cancel_url: `${config.FrontEnd_URL}`,
    amount: payload.price,
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: payload?.isUserExist?.username,
    cus_email: payload.isUserExist?.email,
    cus_add1: payload.isUserExist?.location,
    cus_add2: payload.isUserExist?.location,
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: payload.isUserExist?.phone,
    type: "json",
  });

  return response.data;
};

export const verifyPayment = async (tnxId: string | undefined) => {
  try {
    const response = await axios.get(config.VERIFY_URL!, {
      params: {
        store_id: config.Store_id,
        signature_key: config.SIGNETURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed!");
  }
};
