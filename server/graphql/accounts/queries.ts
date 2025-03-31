import Accounts from "../../models/accounts.ts";
import logger from "../../utils/logger.ts";

export const queries = {
  listAccounts: async (_: any, { filter, pagination }: { filter?: { name?: string; email?: string }, pagination?: { page?: number; limit?: number } }) => {
    
    logger.info("listAccounts filter", filter);
    logger.info("listAccounts pagination", pagination);

    const pipeline: any[] = [];

    if (filter) {
      const match: any = {};
      if (filter.name) {
        match.name = { $regex: filter.name, $options: "i" };
      }
      if (filter.email) {
        match.email = { $regex: filter.email, $options: "i" };
      }
      pipeline.push({ $match: match });
    }

    const page = (pagination && pagination.page) ? pagination.page : 1;
    const limit = (pagination && pagination.limit) ? pagination.limit : 10;
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    pipeline.push({
      $addFields: { id: "$_id" }
    });
    
    pipeline.push({
      $project: { _id: 0, id: 1, name: 1, email: 1, createdAt: 1, updatedAt: 1 }
    });

    let accounts;

    try {
      accounts = await Accounts.aggregate(pipeline);
    } catch (error) {
      logger.error("Error al buscar las cuentas", error);
      throw new Error("Error al buscar las cuentas");
    }

    logger.info("listAccounts accounts", accounts);

    return accounts;
  },
};
