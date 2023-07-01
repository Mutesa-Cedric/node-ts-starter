import express = require("express");
import {
    getCurrentUser,
    login,
    logout,
    signup,
} from "./authController";



const router = express.Router();

router.post('/login', login);
router.post("/signup", signup);
router.get("/me/", getCurrentUser);
router.get("/logout", logout);

export default router;