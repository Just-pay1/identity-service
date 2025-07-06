"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RequestController_1 = __importDefault(require("../controller/RequestController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Create a new request
router.post('/create', auth_1.default, RequestController_1.default.createRequest);
exports.default = router;
