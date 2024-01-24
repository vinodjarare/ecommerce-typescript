import { body } from 'express-validator';
import User from '../models/user.model';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name field is required.'),
  body('email')
    .isEmail()
    .custom(async value => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('User already exists.');
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password field is required.'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email field is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password field is required.'),
];
