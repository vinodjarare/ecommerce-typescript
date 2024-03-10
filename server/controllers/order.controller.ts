import { Request, Response, NextFunction } from 'express';
import Order from '@models/order.model';
import Product from '@models/product.model';
import ErrorHandler from '@utils/errorHandler';
import asyncError from '@utils/asyncError';
import { Types } from 'mongoose';

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */

export const newOrder = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req!.user!.id,
    });

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  }
);

/**
 * @desc    Get single order
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */

export const getSingleOrder = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return next(new ErrorHandler('Order not found with this ID', 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

/**
 * @desc    Get logged in user orders
 * @route   GET /api/v1/orders/me
 * @access  Private
 */

export const myOrders = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ user: req!.user!.id });

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

/**
 * @desc    Get all orders - ADMIN
 * @route   GET /api/v1/admin/orders
 * @access  Private/Admin
 */

export const allOrders = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  }
);

/**
 * @desc    Update / Process order - ADMIN
 * @route   PUT /api/v1/admin/orders/:id
 * @access  Private/Admin
 */

export const updateOrder = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    if (order.orderStatus === 'Delivered') {
      return next(
        new ErrorHandler('You have already delivered this order', 400)
      );
    }

    if (req.body.status === 'Shipped') {
      order.orderItems.forEach(async o => {
        await updateStock(o.id, o.quantity);
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  }
);

async function updateStock(id: Types.ObjectId, quantity: number) {
  const product = await Product.findById(id);

  product!.stock = product!.stock - quantity;

  await product!.save({ validateBeforeSave: false });
}

/**
 * @desc    Delete order
 * @route   DELETE /api/v1/admin/orders/:id
 * @access  Private/Admin
 */

export const deleteOrder = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler('Order not found with this Id', 404));
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  }
);
