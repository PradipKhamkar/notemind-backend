import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string = "success",
  results: any,
  statusCode: number = 200
) => {
  res.status(statusCode)
    .json({
      success: true,
      message,
      results,
    })
};


export const errorResponse = (
  res: Response,
  message: string = "failed",
  results?: any,
  statusCode: number = 400
) => {
  res.status(statusCode)
    .json({
      success: false,
      message,
      results,
    })
};
