import config from "../config";
import axios from "axios";
import { IUser } from "../types/user.type";
import { UserModel } from "../models/user.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshAndAccessToken } from "../helper/jwt.helper";

const googleLogin = async (authCode: string) => {
  try {
    // console.log('AuthCode::', authCode)
    const { ENDPOINT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = config.GOOGLE;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const response = await axios.post(ENDPOINT.TOKEN, new URLSearchParams({
      code: authCode,
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      redirect_uri: REDIRECT_URI || "",
      grant_type: 'authorization_code',
    }),
      { headers: headers }
    );

    const { access_token } = response.data;
    if (!access_token) throw new Error('Access token is missing');
    const userInfo = await axios.get(ENDPOINT.USERINFO.replace('{{access_token}}', access_token));
    const { name, email, picture } = userInfo.data;
    if (!email) throw new Error('Email is missing');
    let user: IUser | null = null;
    user = await UserModel.findOne({ email });
    if (!user) user = await UserModel.create({ loginProvider: "google", email, name, freeNoteQuota: config.FREE_NOTE_QUOTA });
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });
    return {
      accessToken,
      refreshToken,
      user: {
        name,
        email,
        freeQuotaExceed: user.freeQuotaExceed
      }
    }
  } catch (error) {
    console.log('Error Inside Google Login::', error)
    throw error
  }
}

const getNewAccessToken = async (refreshToken: string) => {
  try {
    const decodedToken: any = verifyRefreshAndAccessToken(refreshToken, "REFRESH");
    if (!decodedToken) throw new Error("Invalid Token!");
    const isUserExit = await UserModel.findOne({ _id: decodedToken.userId });
    if (!isUserExit) throw new Error("User not found!");
    const newAccessToken = generateAccessToken({ userId: decodedToken.userId });
    // console.log('newAccessToken', newAccessToken)
    return {
      accessToken: newAccessToken
    };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId: string) => {
  try {
    const userInfo = await UserModel.findOne({ _id: userId });
    if (!userInfo) throw new Error('User Not Found!')
    return {
      user: {
        name: userInfo.name,
        email: userInfo.email,
        freeQuotaExceed: userInfo.freeQuotaExceed
      }
    }
  } catch (error) {
    throw error
  }
}

const deleteAccount = async (userId: string) => {
  try {
    await UserModel.findByIdAndDelete(userId);
    return {
      messages: "user deleted successfully!"
    }
  } catch (error) {
    throw error
  }
}
export default { googleLogin, getNewAccessToken, getUserById, deleteAccount }