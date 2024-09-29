import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const User_Role = {
  admin: "admin",
  user: "user",
} as const;


export type TUserRole = keyof typeof User_Role;
