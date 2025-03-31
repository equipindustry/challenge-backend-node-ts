import Accounts from "../../models/accounts.ts";
import logger from "../../utils/logger.ts";
import { CreateAccountSchema } from "../../validators/account.ts";

export const mutations = {
  createAccount: async (
    _: any,
    { input }: { input: { name: string; email: string } }
  ): Promise<{ name: string; email: string }> => {

    logger.info( "createAccount input", input);
    const parsed = CreateAccountSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid account input");
    }

    const { name, email } = parsed.data;

    let findEmail;

    try {
      findEmail = await Accounts.findOne({ email });
    } catch (error) {
      logger.error( "Error al buscar la cuenta", error);
      throw new Error("Error al buscar la cuenta");
    }

    if (findEmail) {
      throw new Error("La cuenta ya existe");
    }

    let account;

    try {
      account = await Accounts.create({
        name: name,
        email: email,
      });
    } catch (error) {
      logger.error( "Error al crear la cuenta", error);
      throw new Error("Error al crear la cuenta");
    }

    logger.info( "createAccount account", account);

    return {
      name: account.name,
      email: account.email,
    };
  },
};
