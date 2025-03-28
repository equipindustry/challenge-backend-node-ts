import Products from "../../models/products.ts";
import { AddProductsToAccountSchema } from "../../validators/product.ts";
import logger from '../../utils/logger.ts';

export const mutations = {
  addProductsToAccount: async (
    _: any,
    {
      accountId,
      products,
    }: { accountId: string; products: Array<{ name: string; sku: string }> }
  ) => {
    const input = { accountId, products };
    logger.info( "addProductsToAccount input", input);
    const parsed = AddProductsToAccountSchema.safeParse(input);

    if (!parsed.success) {
      throw new Error("Invalid product input");
    }

    let createdProducts;

    try {
      const productsToInsert = products.map((product) => ({
        ...product,
        accountId,
      }));

      createdProducts = await Products.insertMany(productsToInsert);
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error al agregar los productos");
    }

    logger.info( "addProductsToAccount createdProducts", createdProducts);

    return createdProducts;
  },
};
