const env = process.env;


const config = {
    GOOGLE: {
        GEMINI_API_KEY: env["GEMINI_API_KEY "],
    },
    DB: {
        DATABASE_NAME: env.DATABASE_NAME,
        DATABASE_PASSWORD: env.DATABASE_PASSWORD,
        DATABASE_USERNAME: env.DATABASE_USERNAME,
    }
}

export default config;