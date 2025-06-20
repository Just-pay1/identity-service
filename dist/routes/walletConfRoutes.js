"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletConf = require("../controller/WalletConfController");
const auth_1 = __importDefault(require("../middleware/auth"));
const validation_1 = require("../middleware/validation");
const validations_1 = require("../validations");
const router = express_1.default.Router();
router.post("/checkUsernameAvailability", auth_1.default, walletConf.checkUsernameAvailability);
router.post("/username", (0, validation_1.validate)(validations_1.addUsernameSchema), auth_1.default, walletConf.addUsername);
router.post("/pinCode", auth_1.default, (0, validation_1.validate)(validations_1.pincodeSchema), walletConf.addPinCode);
router.post("/confirmPinCode", auth_1.default, (0, validation_1.validate)(validations_1.pincodeSchema), walletConf.pinCodeConfirmation);
//wallet
router.post("/verifyPinCode", auth_1.default, (0, validation_1.validate)(validations_1.pincodeSchema), walletConf.verifyPinCode);
module.exports = router;
