"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const payment_utils_1 = require("./modules/payment/payment.utils");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.databse_url, {
                dbName: "Assignment-6",
            });
            node_cron_1.default.schedule("0 * * * *", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Checking for expired payments...");
                try {
                    yield (0, payment_utils_1.updateExpiredPayments)();
                    console.log("Expired payments check completed.");
                }
                catch (error) {
                    console.error("Error updating expired payments:", error);
                }
            }));
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Server is running on ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
