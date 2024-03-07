import { Request, Response } from 'express';
import asyncError from '@utils/asyncError';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const getPayment = asyncError(async (req: Request, res: Response) => {
  const { amount } = req.body as { amount: number };
  const payment = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'inr',
    metadata: {
      company: 'Ecommerce',
    },
  });

  res.status(200).json({
    success: true,
    clientSecret: payment.client_secret,
  });
});

/**
 * @desc send secret key to clinet
 */

export const sendStripeApiKey = asyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_SECRET_KEY,
    });
  }
);
