"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    databse_url: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    Access_Token: process.env.Access_Token,
    Refresh_Token: process.env.Refresh_Token,
    Access_Token_Expires: process.env.Access_Token_Expires,
    Refresh_Token_Expires: process.env.Refresh_Token_Expires,
    Bcrypt_Salt_Round: process.env.Bcrypt_Salt_Round,
    Reset_pass_ui_link: process.env.Reset_pass_ui_link,
    Store_id: process.env.STORE_ID,
    SIGNETURE_KEY: process.env.SIGNETURE_KEY,
    BASE_URL: process.env.BASE_URL,
    PAYMENT_URL: process.env.PAYMENT_URL,
    VERIFY_URL: process.env.VERIFY_URL,
    FrontEnd_URL: process.env.FrontEnd_URL,
    Backend_URL: process.env.Backend_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
};
