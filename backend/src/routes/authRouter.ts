import express from 'express';
import authController from 'controllers/authController';
import { isEmptyBody, isAuthenticated } from 'middlewares';
import { loginValidation, signupValidation } from 'middlewares/validations';

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

// Current user. Used on app refresh
authRouter.get('/current', isAuthenticated, authController.currentUser);

export default authRouter;
