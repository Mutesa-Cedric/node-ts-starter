import express = require('express');
import UserController from './userController';

const router = express.Router();

router.put('/update', UserController.updateProfile);
router.put('/update-password', UserController.updatePassword);
router.post('/send-verification-code', UserController.sendVerificationCode);
router.post('/reset-password', UserController.resetPassword);
router.post(
  '/validate-verification-code',
  UserController.validateVerificationCode,
);

const userRouter = router;
export default userRouter;
