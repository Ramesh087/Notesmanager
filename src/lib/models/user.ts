import mongoose, { Schema, Document, Model, Types } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  fullname: string;
  password: string;
  refreshToken?: string;
  isAdmin: boolean;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}


const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: 
      {
        type: String,
      },
      isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
 
};


UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
      isAdmin: this.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}as SignOptions
  );
};


UserSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } as SignOptions
  );
};


const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
