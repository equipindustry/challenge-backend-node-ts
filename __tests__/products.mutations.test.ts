import mongoose from "mongoose";
import { mutations } from "../server/graphql/products/mutations";
import Products from "../server/models/products.ts";

describe("addProductsToAccount mutation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

    afterAll(async () => {
      await mongoose.disconnect();
    });
  

  test("should create products successfully", async () => {
    const validAccountId = "603e7d8f3f1d2c1a88e7f35b";
    const validProducts = [
      { name: "Producto A", sku: "SKU-A" },
    ];
    const input = { accountId: validAccountId, products: validProducts };

    // Simulamos la inserción exitosa de productos.
    const mockInserted = [
      {
        _id: "insertedId1",
        name: "Producto A",
        sku: "SKU-A",
        accountId: validAccountId,
        __v: 0,
      },
    ];
    const insertManyMock = jest
      .spyOn(Products, "insertMany")
      .mockResolvedValue(mockInserted as any);

    const result = await mutations.addProductsToAccount({}, input);
    expect(result).toEqual(mockInserted);
    expect(insertManyMock).toHaveBeenCalledWith(
      validProducts.map((product) => ({
        ...product,
        accountId: validAccountId,
      }))
    );
  });

  test("should throw error for invalid product input", async () => {
    // Usamos un accountId inválido y un array vacío de productos.
    const invalidInput = { accountId: "123", products: [] };

    await expect(
      mutations.addProductsToAccount({}, invalidInput)
    ).rejects.toThrow("Invalid product input");
  });

  test("should throw error if Products.insertMany fails", async () => {
    const validAccountId = "603e7d8f3f1d2c1a88e7f35b";
    const validProducts = [{ name: "Producto A", sku: "SKU-A" }];
    const input = { accountId: validAccountId, products: validProducts };

    jest
      .spyOn(Products, "insertMany")
      .mockRejectedValue(new Error("DB error"));

    await expect(
      mutations.addProductsToAccount({}, input)
    ).rejects.toThrow("Error al agregar los productos");
  });
});