"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use("/", (req, res) => {
    console.log("el pop");
    res.send("<h1>El pop</h1>");
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});
