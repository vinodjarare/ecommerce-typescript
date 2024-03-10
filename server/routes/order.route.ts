import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrder,
} from '@controllers/order.controller';
import { authorizeRoles, isAuthenticatedUser } from '@middleware/auth';
import { Router } from 'express';

const router = Router();

router.route('/orders/new').post(isAuthenticatedUser, newOrder);

router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder);

router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);

router
  .route('/admin/orders/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;
