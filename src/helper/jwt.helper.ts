import config from "../config";
import { IRefreshTokenPayload } from "../types/token.type";
import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload: IRefreshTokenPayload) => {
  try {
    const token = jwt.sign(payload, config.TOKENS.REFRESH_TOKEN_SECRET, { expiresIn: "10d" });
    return token
  } catch (error) {
    throw error
  }
}

export const generateAccessToken = (payload: IRefreshTokenPayload) => {
  try {
    const token = jwt.sign(payload, config.TOKENS.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    return token
  } catch (error) {
    throw error
  }
}

export const verifyRefreshAndAccessToken = (token: string,tokenType:"ACCESS"|"REFRESH") => {
  try {
    const key = tokenType === "ACCESS" ? config.TOKENS.ACCESS_TOKEN_SECRET : config.TOKENS.REFRESH_TOKEN_SECRET
    const decoded = jwt.verify(token, key);
    return decoded
  } catch (error) {
    throw error
  }
}
