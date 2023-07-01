import express = require("express");
import {
    resetPassword,
    sendVerificationCode,
    updatePassword,
    updateProfile,
    validateVerificationCode
} from "./userController";

const router = express.Router();

router.put("/update", updateProfile);
router.put("/update-password", updatePassword);
router.post("/send-verification-code",sendVerificationCode);
router.post("/reset-password",resetPassword);
router.post("/validate-verification-code",validateVerificationCode);

export default router;