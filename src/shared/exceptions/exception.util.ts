import { CustomException } from "@/shared/exceptions/custom-exception";
import { ErrorResponse } from "@/shared/types/common.type";
import { StatusCode } from "@/shared/types/status-code.type";
import { ZodError } from "zod";

class ExceptionUtils {
  public getResponse = (err: Error): [StatusCode, ErrorResponse] => {
    console.error(err);
    let status: StatusCode = 500;
    let message: string = "Something Went Wrong";
    if (err instanceof CustomException) {
      status = err.status || 400;
      message = err.message || "Something Went Wrong";
      return [status, { status, message }];
    }
    if (err instanceof ZodError) {
      status = 400;
      message = err.errors[0]?.message || "Something Went Wrong";
      return [status, { status, message }];
    }
    return [status, { status, message }];
  };
}

export const exceptionUtils = new ExceptionUtils();
