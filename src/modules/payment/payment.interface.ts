import mongoose from "mongoose";

export interface IPayment {
  user: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod?: string;
  status: "Pending" | "Completed" | "Failed";
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
   verificationBadge: string | null;
   gender: string;
   status: string;
   createdAt: Date;
   updatedAt: Date;
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
