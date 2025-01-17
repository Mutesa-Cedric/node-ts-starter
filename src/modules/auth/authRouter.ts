import express = require('express');
import AuthController from './authController';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.get('/me/', AuthController.getCurrentUser);
router.get('/logout', AuthController.logout);

const authRouter = router;
export default authRouter;
