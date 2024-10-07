"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const comment_validation_1 = require("./comment.validation");
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const interface_1 = require("../../interface");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(comment_validation_1.CommentValidation.commentSchema), comment_controller_1.CommentController.createComment);
router.get("/get-all", comment_controller_1.CommentController.getAllComments);
router.get("/get-single/:id", comment_controller_1.CommentController.getSingleComment);
router.delete("/delete/:id", (0, auth_1.default)(interface_1.User_Role.user, interface_1.User_Role.admin), comment_controller_1.CommentController.deleteComment);
exports.CommentRoute = router;
