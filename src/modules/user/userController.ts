import { Request, Response } from 'express';
import { comparePassword } from '../../utils/bcrypt';
import { verifyToken } from '../../utils/jwt';
import { sendEmail } from '../../utils/nodemailer';
import User from './userModel';
import UserService from './userService';
import { generateVerificationCode } from '../../utils';

export default class UserController {
  public static updateProfile = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = await verifyToken(token);
      const user = await UserService.findUserById(id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      await user.save();

      res.status(200).json({ message: 'success', user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public static updatePassword = async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = await verifyToken(token);
      const user = await UserService.findUserById(id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
  public static sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          message: 'Email is required',
        });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid Email',
        });
      }
      // generate verification code of 6 digits
      let verificationCode = generateVerificationCode();
      user.verificationCode!.code = verificationCode.toString();
      user.verificationCode!.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();
      const { sent } = await sendEmail({
        to: email,
        body: `your verification code is : ${verificationCode.toString()}`,
        subject: ' Verify your account',
      });
      if (sent) {
        res.status(200).json({
          message: 'success',
        });
      } else {
        res.status(500).json({
          message: 'Failed to send verification code',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  public static validateVerificationCode = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { code, email } = req.body;
      if (!code || !email) {
        return res.status(400).json({
          missingFields: {
            code: !code ? 'missing' : 'present',
            email: !email ? 'missing' : 'present',
          },
        });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid email ',
        });
      }
      // check if code has expired
      // @ts-ignore
      if (user.verificationCode!.expiresAt.getTime() < Date.now()) {
        return res.status(400).json({
          expired: true,
          message: 'Verification code has expired',
        });
      }
      if (user.verificationCode!.code !== code) {
        return res.status(400).json({
          invalidCode: true,
          message: 'Invalid verification code',
        });
      }
      user.verificationCode!.code = 'default';
      user.verificationCode!.expiresAt = new Date(0);

      await user.save();

      res.status(200).json({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  public static resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          missingFields: {
            email: !email ? 'missing' : 'present',
            password: !password ? 'missing' : 'present',
          },
        });
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: 'Invalid email',
        });
      }
      user.password = password;
      await user.save();

      res.status(200).json({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
    }
  };
}
