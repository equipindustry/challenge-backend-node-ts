import Products from '../../models/products.ts';

export const mutations = {
  addProductsToAccount: async (
    _: any,
    { accountId, products }: { accountId: string; products: Array<{ name: string; sku: string }> }
  ) => {
    try {
      // Asigna el accountId a cada producto antes de insertarlo
      const productsToInsert = products.map(product => ({
        ...product,
        accountId,
      }));

      const createdProducts = await Products.insertMany(productsToInsert);
      return createdProducts;
    } catch (error: any) {
      throw new Error("Error al agregar productos: " + error.message);
    }
  },
};
