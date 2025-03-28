import mongoose from 'mongoose';
import { queries } from '../server/graphql/products/queries';
import Products from '../server/models/products';

describe('listProducts Query', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should return products when called with valid parameters', async () => {
    // Simulamos el resultado que se espera de Products.aggregate
    const fakeProducts = [
      {
        id: '1',
        name: 'Producto A',
        sku: 'SKU-A',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
        accountDetails: {
          id: '100',
          name: 'Juan',
          email: 'juan@example.com',
        },
      },
    ];

    const aggregateSpy = jest
      .spyOn(Products, 'aggregate')
      .mockResolvedValue(fakeProducts as any);

    const result = await queries.listProducts(
      {},
      { filter: { name: 'Producto' }, pagination: { page: 1, limit: 10 } }
    );

    expect(result).toEqual(fakeProducts);
    expect(aggregateSpy).toHaveBeenCalled();
  });

  test('should throw error if Products.aggregate fails', async () => {
    const errorMessage = 'Aggregation error';
    jest
      .spyOn(Products, 'aggregate')
      .mockRejectedValue(new Error(errorMessage));

    await expect(queries.listProducts({}, {})).rejects.toThrow(
      'Error al buscar los productos'
    );
  });
});
