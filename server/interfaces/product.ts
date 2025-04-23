import { Types } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  sku: string;
  accountId: Types.ObjectId;
  account?: { name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}
