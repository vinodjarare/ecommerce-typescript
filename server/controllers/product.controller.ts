import { NextFunction, Request, Response } from 'express';
import Product from '@models/product.model';
import asyncError from '@utils/asyncError';
import { deleteFile, uploadFile } from '@utils/s3';
import SearchProduct from '@utils/productSearch';
import ErrorHandler from '@utils/errorHandler';
import { Review } from '../types/models';

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

/**
 * @GET
 * @route /api/v1/product
 */

export const getProducts = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const RESULT_PER_PAGE = Number(req.query.limit) || 10;
    // total product count

    const productCount = await Product.countDocuments();

    const filterProducts = new SearchProduct(Product.find(), req.query);

    let products = await filterProducts.query;

    let filteredProductCount = products.length;

    filterProducts.pagination(RESULT_PER_PAGE);
    products = await filterProducts.query.clone();

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      productCount,
      filteredProductCount,
      limit: RESULT_PER_PAGE,
    });
  }
);

/**
 * @GET
 * @route /api/v1/product/:id
 */

export const getProduct = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler('Product not found', 404));

    return res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  }
);

/**
 * @PUT
 * @route /api/v1/product/:id
 */

export const updateProduct = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler('Product not found', 404));

    const files = req.files as Express.Multer.File[];

    const images: string[] = files
      ? await Promise.all(
          files?.map((file: Express.Multer.File) => {
            const fileKey = `${PRODUCT_DESTINATION}${Date.now()}-${
              file.originalname
            }`;
            return uploadFile(fileKey, file.buffer);
          })
        )
      : [];

    req.body.images = [...product.images, ...images];

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  }
);

/**
 * @DELETE
 * @route /api/v1/product/:id
 */

export const deleteProduct = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    product?.images?.forEach(async (image: string) => {
      await deleteFile(image);
    });

    if (!product) return next(new ErrorHandler('Product not found', 404));

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
);

//TODO: craeate review

/**
 * @PUT
 * @route /api/product/review
 */

export const createReview = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req?.user?._id,
      name: req?.user?.name,
      rating: Number(rating),
      comment,
    } as Review;

    const product = await Product.findById(productId);

    const isReviewed = product?.reviews?.find(
      r => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
      product?.reviews?.forEach(review => {
        if (review.user.toString() === req?.user?._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product?.reviews?.push(review);
      product!.numOfReviews++;
    }

    product!.ratings =
      product!.reviews?.reduce((acc, item) => item.rating + acc, 0) /
      product!.reviews?.length;

    await product?.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Review added successfully',
    });
  }
);

/**
 * @DELETE
 * @route /api/product/review
 */

export const deleteReview = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product?.reviews?.filter(
      review => review.user.toString() !== req?.user?._id.toString()
    );

    const numOfReviews = reviews?.length as number;

    const ratings =
      product!.reviews?.reduce((acc, item) => item.rating + acc, 0) /
      numOfReviews;

    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      ratings,
      numOfReviews,
    });

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  }
);

/**
 * @GET
 * @route /api/v1/product/reviews
 */

export const getProductReviews = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    res.status(200).json({
      success: true,
      message: 'Product reviews fetched successfully',
      data: product?.reviews,
    });
  }
);
