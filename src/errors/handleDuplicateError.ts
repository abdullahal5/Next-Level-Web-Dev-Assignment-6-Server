/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSourses, TGenereicErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenereicErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMsg = match && match[1];

  const errorSources: TErrorSourses = [
    {
      path: "",
      message: `${extractedMsg} is all ready exists!!!`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleDuplicateError;
