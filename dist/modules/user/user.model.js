"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^([\w.-]+@[\w-]+\.[\w-]{2,4})?$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: "https://i.ibb.co/vkVW6s0/download.png",
    },
    bio: {
        type: String,
        maxlength: 101,
    },
    followers: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    favourite: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Post",
        },
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
    dateOfBirth: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    gardeningExperienceLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    interests: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active"
    },
    socialMediaLinks: {
        facebook: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        },
        instagram: {
            type: String,
            required: false,
        },
        linkedin: {
            type: String,
            required: false,
        },
    },
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.Bcrypt_Salt_Round));
        next();
    });
});
UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimeStamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimeStamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
