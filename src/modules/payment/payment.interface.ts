import mongoose from "mongoose";

export interface IPayment {
  user: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod?: string;
  status: "Active" | "Expired";
  transactionId: string;
  planTitle: string;
  planPrice: number;
  expiryDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SocialMediaLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface IsUserExist {
  socialMediaLinks: SocialMediaLinks;
  _id: string;
  email: string;
  password: string;
  role: string;
  username: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  favourite: string[];
  isVerified: boolean;
  gender: string;
  status: string;
  bio: string;
  dateOfBirth: Date;
  gardeningExperienceLevel: string;
  interests: string;
  location: string;
  phone: string;
}

export interface PaymentData {
  user: string;
  title: string;
  price: string;
  expiry: string;
  transactionId: string;
  isUserExist: IsUserExist | null;
}
