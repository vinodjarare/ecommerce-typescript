import { Router } from 'express';
import upload from '../utils/uploader';
import { createProduct } from '../controllers/product.controller';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.any(),
    createProduct
  );

export default router;
