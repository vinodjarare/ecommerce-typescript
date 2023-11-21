import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import { IFile, upload } from '../utils/upload';
import sendToken from '../utils/jwtToken';
import asyncError from '../utils/asyncError';
import ErrorHandler from '../utils/errorHandler';
import crypto from 'crypto';
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as IFile[];
    const file =
      files && files.filter((file: IFile) => file.fieldname === 'avatar').length
        ? files.filter((file: IFile) => file.fieldname === 'avatar')[0]
        : null;

    const avatar = file && (await upload(file, 'users'));

    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// user login

export const login = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler('Invalid email or password', 401));
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return next(new ErrorHandler('Invalid email or password', 401));
    sendToken(user, 200, res);
  }
);

export const logout = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: 'Logged out',
    });
  }
);

export const forgotPassword = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler('User not found', 404));

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host'
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const resetPassword = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return next(
        new ErrorHandler(
          'Reset Password Token is invalid or has been expired',
          400
        )
      );

    if (req.body.password !== req.body.confirmPassword)
      return next(new ErrorHandler('Password does not match', 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  }
);

// GET USER DETAILS

export const getUserDetails = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user?.id as string;
    const user = await User.findById(user_id);

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// UPDATE USER PASSWORD

export const updatePassword = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id).select('+password');
    if (!user) return next(new ErrorHandler('User not found', 404));
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched)
      return next(new ErrorHandler('Old password is incorrect', 400));
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res);
  }
);

// UPDATE USER PROFILE
export const updateProfile = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user?.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
);

// GET ALL USERS (ADMIN)

export const getAllUsers = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);
    res.status(200).json({
      success: true,
      users,
      totalUsers,
      limit,
      page,
    });
  }
);

// GET SINGLE USER (ADMIN)

export const getSingleUser = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler('User not found', 404));
    res.status(200).json({
      success: true,
      user,
    });
  }
);

// UPDATE USER ROLE -- ADMIN

export const updateUserRole = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
);

// DELETE USER -- ADMIN

export const deleteUser = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User Deleted Successfully',
    });
  }
);
