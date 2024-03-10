import { getPayment, sendStripeApiKey } from '@controllers/payment.controller';
import { isAuthenticatedUser } from '@middleware/auth';
import { Router } from 'express';

const router = Router();

router
  .route('/payment')
  .post(isAuthenticatedUser, getPayment)
  .get(isAuthenticatedUser, sendStripeApiKey);

export default router;
