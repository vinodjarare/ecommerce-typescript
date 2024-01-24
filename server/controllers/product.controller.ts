import { NextFunction, Request, Response } from 'express';
import Product from '../models/product.model';
import asyncError from '../utils/asyncError';
import { uploadFile } from '../utils/s3';

const PRODUCT_DESTINATION = `products/`;

export const createProduct = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    /** upload images */
    const images =
      files &&
      (await Promise.all(
        files?.map((file: Express.Multer.File) => {
          const fileKey = `${PRODUCT_DESTINATION}${Date.now()}-${
            file.originalname
          }`;
          return uploadFile(fileKey, file.buffer);
        })
      ));

    req.body.images = images;
    req.body.user = req?.user?._id;
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }
);
