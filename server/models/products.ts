import { Schema } from "mongoose";

import { IProduct } from "../interfaces/product.ts";

import { cnxProducts } from "../db/mongodb.ts";

const productsSchema = new Schema<IProduct>(
  {
    name: { type: String },
    sku: { type: String },
    accountId: { type: Schema.Types.ObjectId, required: true, ref: "accounts" },
  },
  { timestamps: true }
);

const Products = cnxProducts.model<IProduct>("Products", productsSchema);

export default Products;
