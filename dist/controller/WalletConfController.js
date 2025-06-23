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
const userModel_1 = __importDefault(require("../models/userModel"));
// import sendMessage from "../services/rabbitmq";
const rabbitmq_1 = __importDefault(require("../util/rabbitmq"));
exports.checkUsernameAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
        const user = yield userModel_1.default.findOne({ where: { username } });
        return res.json({ available: !user });
    }
    catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.addUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("heer");
    try {
        const user_id = req.userId;
        // console.log(user_id)
        const { username } = req.body;
        // console.log(username);
        const user = yield userModel_1.default.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield user.update({ username: username });
        return res.status(200).json({ message: "username added successfully" });
    }
    catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.addPinCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.userId;
        const { pin_code } = req.body;
        const user = yield userModel_1.default.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield user.update({ pin_code: pin_code });
        return res.status(200).json({ message: "pin_code added successfully" });
    }
    catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.pinCodeConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rabbitMQ = yield rabbitmq_1.default.getInstance();
        const user_id = req.userId;
        const { pin_code: pin_code_confirmed } = req.body;
        const user = yield userModel_1.default.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pin_code = user.pin_code;
        console.log(pin_code);
        if (pin_code !== pin_code_confirmed) {
            return res.status(400).json({ message: "Pin code Mustmatch" });
        }
        yield user.update({ pin_code_confirmation: true });
        // await sendMessage("wallet_creation", {
        //   userId: user.id,
        // });
        rabbitMQ.pushInWalletCreationQueue({ userId: user.id });
        return res
            .status(200)
            .json({ message: "pin code confirmed", username: user.username });
    }
    catch (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.verifyPinCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.userId;
        const { pin_code } = req.body;
        const user = yield userModel_1.default.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pin_codeDB = user.pin_code;
        if (pin_code !== pin_codeDB) {
            return res.status(400).json({ message: "Pin code is incorrect" });
        }
        return res.status(200).json({ message: "pin code correct" });
    }
    catch (err) {
        console.error("Error verifying pin code:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
