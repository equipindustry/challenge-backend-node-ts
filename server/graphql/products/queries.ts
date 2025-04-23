import Products from "../../models/products.ts";
import logger from "../../utils/logger.ts";

export const queries = {
  listProducts: async (
    _: any,
    {
      filter,
      pagination,
    }: {
      filter?: { name?: string; sku?: string };
      pagination?: { page?: number; limit?: number };
    }
  ) => {

    logger.info( "listProducts filter", filter);
    logger.info( "listProducts pagination", pagination);

    const pipeline: any[] = [];

    if (filter) {
      const match: any = {};
      if (filter.name) {
        match.name = { $regex: filter.name, $options: "i" };
      }
      if (filter.sku) {
        match.sku = { $regex: filter.sku, $options: "i" };
      }
      pipeline.push({ $match: match });
    }

    const page = pagination && pagination.page ? pagination.page : 1;
    const limit = pagination && pagination.limit ? pagination.limit : 10;
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    pipeline.push({
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "accountDetails",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$accountDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        sku: 1,
        createdAt: 1,
        updatedAt: 1,
        accountDetails: {
          id: { $toString: "$accountDetails._id" },
          name: "$accountDetails.name",
          email: "$accountDetails.email"
        },
      },
    });

    let products;

    try {
      products = await Products.aggregate(pipeline);
    } catch (error) {
      logger.error( "Error al buscar los productos", error);
      throw new Error("Error al buscar los productos");
    }

    logger.info( "listProducts products", products);

    return products;
  },
};