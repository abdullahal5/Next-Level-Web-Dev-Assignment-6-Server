"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const comment_route_1 = require("../modules/comment/comment.route");
const post_route_1 = require("../modules/post/post.route");
const payment_route_1 = require("../modules/payment/payment.route");
const dasboard_route_1 = require("../modules/dashboard/dasboard.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/comment",
        route: comment_route_1.CommentRoute,
    },
    {
        path: "/post",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoute,
    },
    {
        path: "/dashboard",
        route: dasboard_route_1.DashboardRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
