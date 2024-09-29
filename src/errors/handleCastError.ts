import mongoose from "mongoose";
import { TErrorSourses, TGenereicErrorResponse } from "../interface/error";

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenereicErrorResponse => {
  const errorSources: TErrorSourses = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
