"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env;
const config = {
    GOOGLE: {
        GEMINI_API_KEY: env.GEMINI_API_KEY,
        CLIENT_ID: env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
        REDIRECT_URI: env.GOOGLE_REDIRECT_URI,
        ENDPOINT: {
            TOKEN: 'https://oauth2.googleapis.com/token',
            USERINFO: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token={{access_token}}'
        }
    },
    DB: {
        DATABASE_NAME: env.DATABASE_NAME,
        DATABASE_PASSWORD: env.DATABASE_PASSWORD,
        DATABASE_USERNAME: env.DATABASE_USERNAME,
    },
    CLOUDINARY: {
        CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
        API_KEY: env.CLOUDINARY_API_KEY,
        API_SECRET: env.CLOUDINARY_API_SECRET,
        FOLDER_NAME: env.CLOUDINARY_FOLDER_NAME
    },
    TOKENS: {
        ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET || "",
        REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET || ""
    },
};
exports.default = config;
