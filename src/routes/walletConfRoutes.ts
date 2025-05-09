import express from "express";
const walletConf = require("../controller/WalletConfController");
import authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validation";
import { addUsernameSchema, pincodeSchema } from "../validations";

const router = express.Router();

router.post(
  "/checkUsernameAvailability",
  authMiddleware,
  walletConf.checkUsernameAvailability
);

router.post(
  "/username",
  validate(addUsernameSchema),
  authMiddleware,
  walletConf.addUsername
);
router.post(
  "/pinCode",
  authMiddleware,
  validate(pincodeSchema),
  walletConf.addPinCode
);
router.post(
  "/confirmPinCode",
  authMiddleware,
  validate(pincodeSchema),
  walletConf.pinCodeConfirmation
);
//wallet
router.post(
  "/verifyPinCode",
  authMiddleware,
  validate(pincodeSchema),
  walletConf.verifyPinCode
);

module.exports = router;
