"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const interface_1 = require("../../interface");
const router = express_1.default.Router();
router.get("/get-myStats", (0, auth_1.default)(interface_1.User_Role.admin, interface_1.User_Role.user), dashboard_controller_1.DashboardController.dashbaordContent);
exports.DashboardRoute = router;
