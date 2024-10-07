import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import cron from "node-cron";
import { updateExpiredPayments } from "./modules/payment/payment.utils";

async function main() {
  try {
    await mongoose.connect(config.databse_url as string, {
      dbName: "Assignment-6",
    });

    cron.schedule("0 * * * *", async () => {
      console.log("Checking for expired payments...");
      try {
        await updateExpiredPayments();
        console.log("Expired payments check completed.");
      } catch (error) {
        console.error("Error updating expired payments:", error);
      }
    });

    app.listen(config.port, () => {
      console.log(`Server is running on ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
