import express from 'express';
import authController from 'controllers/authController';
import {
  isEmptyBody,
  isAuthenticated,
  signupValidation,
  loginValidation,
  editInfoVaidation,
  emailValidation,
  passwordValidation,
} from 'middlewares';

const authRouter = express.Router();

// Registration
authRouter.post(
  '/signup',
  isEmptyBody,
  signupValidation,
  authController.signup
);
authRouter.post('/login', isEmptyBody, loginValidation, authController.login);
authRouter.post('/logout', isAuthenticated, authController.logout);

// User information edit
authRouter.put(
  '/edit-info',
  isAuthenticated,
  isEmptyBody,
  editInfoVaidation,
  authController.edit
);

// Password restoration
authRouter.post(
  '/forgot-password',
  isEmptyBody,
  emailValidation,
  authController.forgotPassword
);
authRouter.patch(
  '/restore/:restorationToken',
  isEmptyBody,
  passwordValidation,
  authController.restorePassword
);

// Current user. Used on app refresh
authRouter.get('/current', isAuthenticated, authController.currentUser);

// Email verification
authRouter.get('/verify/:verificationToken', authController.verify);
authRouter.post(
  '/verify',
  isEmptyBody,
  emailValidation,
  authController.resendEmail
);

export default authRouter;
