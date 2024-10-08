import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { DashboardServices } from "./dashboard.service";

const dashbaordContent = catchAsync(async (req, res) => {
  const payments = await DashboardServices.dashboardServices(req.user?.userId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard Data retireved successfully",
    data: payments,
  });
});

export const DashboardController = {
  dashbaordContent,
};
