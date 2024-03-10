import { Router } from 'express';
import productRoute from '@routes/product.route';
import userRoute from '@routes/user.route';
import orderRoute from '@routes/order.route';
import paymentRoute from '@routes/payment.route';
const router = Router();

router.use('/v1', userRoute);
router.use('/v1', productRoute);
router.use('/v1', orderRoute);
router.use('/v1', paymentRoute);

export default router;
