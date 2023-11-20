import { Router } from 'express';
import { login, register } from '../controllers/users.controller';
import upload from '../utils/uploader';
import {
  loginValidation,
  registerValidation,
} from '../validation/user.validation';
import validateRequest from '../validation/validate';
const router = Router();

router.post(
  '/register',
  upload.any(),
  registerValidation,
  validateRequest,
  register
);

router.route('/login').post(loginValidation, validateRequest, login);
export default router;
