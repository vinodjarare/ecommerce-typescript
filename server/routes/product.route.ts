import { Router } from 'express';
import upload from '@utils/uploader';
import {
  createProduct,
  createReview,
  deleteProduct,
  deleteReview,
  getProduct,
  getProductReviews,
  getProducts,
  updateProduct,
} from '@controllers/product.controller';
import { authorizeRoles, isAuthenticatedUser } from '@middleware/auth';

const router = Router();

router
  .route('/products')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.any(),
    createProduct
  )
  .get(getProducts);

router
  .route('/products/reviews')
  .put(isAuthenticatedUser, createReview)
  .get(isAuthenticatedUser, getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

router
  .route('/products/:id')
  .get(getProduct)
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.any(),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

export default router;
