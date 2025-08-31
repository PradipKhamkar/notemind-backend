const env = process.env;


const config = {
    GOOGLE: {
        GEMINI_API_KEY: env.GEMINI_API_KEY,
    },
    DB: {
        DATABASE_NAME: env.DATABASE_NAME,
        DATABASE_PASSWORD: env.DATABASE_PASSWORD,
        DATABASE_USERNAME: env.DATABASE_USERNAME,
    },
    CLOUDINARY:{
        CLOUD_NAME:env.CLOUDINARY_CLOUD_NAME,
        API_KEY:env.CLOUDINARY_API_KEY,
        API_SECRET:env.CLOUDINARY_API_SECRET,
        FOLDER_NAME:env.CLOUDINARY_FOLDER_NAME
    }
}

export default config;