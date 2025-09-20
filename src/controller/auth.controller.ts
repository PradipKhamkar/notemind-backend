import { Request, Response } from "express";
import userService from "../services/auth.service";
import { errorResponse, successResponse } from "../helper/response.helper";
import responseStatusCode from "../constants/responseCode.constant";

const googleAuth = async (req: Request, res: Response) => {
  try {
    const results = await userService.googleLogin(req.body.authCode);
    successResponse(res, "Login Successfully", results, responseStatusCode.OK);
  } catch (error: any) {
    errorResponse(res, error?.message);
  }
};

const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const newToken = await userService.getNewAccessToken(req.body.token);
    successResponse(res, "success", newToken, responseStatusCode.OK);
  } catch (error: any) {
    console.log('Error::', error)
    errorResponse(res, error?.messages);
  }
};

const getLoggedUser = async (req: any, res: Response) => {
  try {
    const newToken = await userService.getUserById(req.userId);
    successResponse(res, "success", newToken, responseStatusCode.OK);
  } catch (error: any) {
    errorResponse(res, error?.messages);
  }
};

const deleteAccount = async (req: any, res: Response) => {
  try {
    const result = await userService.deleteAccount(req.userId);
    successResponse(res, "success", result, responseStatusCode.OK);
  } catch (error: any) {
    errorResponse(res, error?.messages);
  }
};



export default { googleAuth, getNewAccessToken, getLoggedUser,deleteAccount };