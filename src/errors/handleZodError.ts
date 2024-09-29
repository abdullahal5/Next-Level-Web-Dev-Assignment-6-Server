import { ZodError, ZodIssue } from "zod";
import { TErrorSourses, TGenereicErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenereicErrorResponse => {
  const errorSources: TErrorSourses = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};

export default handleZodError;
