import Accounts from "../../models/accounts.ts";

export const mutations = {
  createAccount: async (
    _: any,
    { input }: { input: { name: string; email: string } }
  ): Promise<{ name: string; email: string }> => {
    const { name, email } = input;

    let findEmail;

    try {
      findEmail = await Accounts.findOne({ email });
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw new Error("Error al crear la cuenta");
    }

    return {
      name: account.name,
      email: account.email,
    };
  },
};
