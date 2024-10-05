import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

type JwtpayloadData = {
  userId: mongoose.Types.ObjectId | undefined;
  username: string | undefined;
  email: string | undefined;
  role: string | undefined;
  gender: string | undefined;
  status: string | undefined
  profileImage: string | undefined;
};

export const createToken = (
  jwtPayload: JwtpayloadData,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
