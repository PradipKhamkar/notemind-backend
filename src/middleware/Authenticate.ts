import { NextFunction, Request, Response } from "express";
import { verifyRefreshAndAccessToken } from "../helper/jwt.helper";
import { errorResponse } from "../helper/response.helper";

const Authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split("Bearer")[1].trim();
    if (!token) throw new Error("Token Not Found");
    const decoded = verifyRefreshAndAccessToken(token, "ACCESS");
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.log("Error::", error);
    if (error?.message === "jwt expired")
      errorResponse(res, "Unauthorized", {}, 401);
    else errorResponse(res, error?.message);
  }
};

export default Authenticate;
