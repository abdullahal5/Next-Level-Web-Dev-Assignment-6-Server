import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../interface";
import { UserModel } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route!",
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, config.Access_Token as string) as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Jwt expired");
    }

    const { role, userId, iat } = decoded;

    const isUserExist = await UserModel.findById(userId);

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (
      isUserExist.passwordChangedAt &&
      UserModel.isJWTIssuedBeforePasswordChanged(
        isUserExist.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route!",
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
