import { Schema, model, Model } from 'mongoose';
import { IProduct, IReview } from '../types/models';

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please Enter product Name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please Enter product Description'],
  },
  price: {
    type: Number,
    required: [true, 'Please Enter product Price'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: [true, 'Please Enter Product Category'],
  },
  stock: {
    type: Number,
    required: [true, 'Please Enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 characters'],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product: Model<IProduct> = model('Product', productSchema);

export default Product;
