import { Socket } from "socket.io";
import { verifyRefreshAndAccessToken } from "../helper/jwt.helper";
import { UserModel } from "../models/user.model";


const AuthenticateSocket = async (socket: Socket, next: any) => {
  try {
    const accessToken = socket.handshake.auth.accessToken;
    console.log('accessToken', accessToken)
    const decodedToken = verifyRefreshAndAccessToken(accessToken, "ACCESS");
    if (!decodedToken) throw new Error("Invalid Token");
    // @ts-ignore
    const userInfo = await UserModel.findById(decodedToken.userId);
    if (!userInfo) throw new Error("User Not Found");
    // @ts-ignore
    socket.user = userInfo
    next();
  } catch (error: any) {
    if (error?.message === "jwt expired") return next(new Error("unauthorized"));
    return next(new Error(error?.message || "Authentication Failed!"));
  }
};

export default AuthenticateSocket;
