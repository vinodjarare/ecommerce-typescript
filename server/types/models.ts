import { Document, Types } from 'mongoose';
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  getJWTToken: () => string;
  comparePassword: (password: string) => Promise<string>;
  getResetPasswordToken: () => string;
}

export interface IReview {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  ratings: number;
  images: string[];
  category: string;
  stock: number;
  numOfReviews: number;
  reviews: IReview[];
  user: Types.ObjectId;
  createdAt: Date;
}
export interface IShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNo: number;
}

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  id: Types.ObjectId;
}

export interface IPaymentInfo {
  id: string;
  status: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  shippingInfo: IShippingInfo;
  orderItems: IOrderItem[];
  user: Types.ObjectId;
  paymentInfo: IPaymentInfo;
  paidAt: Date;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: string;
  deliveredAt?: Date;
  createdAt: Date;
}

export interface Review {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}