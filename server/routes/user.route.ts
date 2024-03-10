import { Router } from 'express';
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole,
} from '@controllers/users.controller';
import upload from '@utils/uploader';
import {
  loginValidation,
  registerValidation,
} from '@validation/user.validation';
import validateRequest from '@validation/validate';
import { authorizeRoles, isAuthenticatedUser } from '@middleware/auth';
const router = Router();

router.post(
  '/register',
  upload.any(),
  registerValidation,
  validateRequest,
  register
);

router.route('/login').post(loginValidation, validateRequest, login);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserDetails);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

router
  .route('/admin/users/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);


export default router;
