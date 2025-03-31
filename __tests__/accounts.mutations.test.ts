import { mutations } from "../server/graphql/accounts/mutations.ts";
import Accounts from "../server/models/accounts.ts";
import mongoose from 'mongoose';


describe("createAccount mutation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should create account successfully", async () => {
    const validInput = { name: "Test User", email: "test@example.com" };

    // Simulamos que no existe una cuenta con ese email.
    const findOneMock = jest.spyOn(Accounts, "findOne").mockResolvedValue(null);

    // Simulamos la creación de la cuenta.
    const mockAccount = {
        _id: "mocked_id",
        name: validInput.name,
        email: validInput.email,
        __v: 0,
        };
      const createMock = jest.spyOn(Accounts, "create").mockResolvedValue({
        ...mockAccount,
        save: jest.fn(), // Add a mock save method if required by the type
      } as any); // Use `as any` to bypass type-checking for the mock

    const result = await mutations.createAccount({}, { input: validInput });

    expect(result).toEqual({ name: validInput.name, email: validInput.email });
    expect(findOneMock).toHaveBeenCalledWith({ email: validInput.email });
    expect(createMock).toHaveBeenCalledWith({ name: validInput.name, email: validInput.email });
  });

  test("should throw error for invalid account input", async () => {
    // Caso de input inválido.
    const invalidInput = { name: "", email: "invalid-email" };

    await expect(mutations.createAccount({}, { input: invalidInput })).rejects.toThrow("Invalid account input");
  });

  test("should throw error if account already exists", async () => {
    const validInput = { name: "Test User", email: "test@example.com" };

    // Simulamos que ya existe una cuenta con ese email.
    jest.spyOn(Accounts, "findOne").mockResolvedValue({ name: "Existing", email: validInput.email });

    await expect(mutations.createAccount({}, { input: validInput })).rejects.toThrow("La cuenta ya existe");
  });

  test("should throw error if findOne fails", async () => {
    const validInput = { name: "Test User", email: "test@example.com" };

    // Simulamos un fallo en la función findOne.
    jest.spyOn(Accounts, "findOne").mockRejectedValue(new Error("DB error"));

    await expect(mutations.createAccount({}, { input: validInput })).rejects.toThrow("Error al buscar la cuenta");
  });

  test("should throw error if create fails", async () => {
    const validInput = { name: "Test User", email: "test@example.com" };

    // Simulamos que no existe una cuenta (findOne retorna null).
    jest.spyOn(Accounts, "findOne").mockResolvedValue(null);
    // Simulamos un fallo en la función create.
    jest.spyOn(Accounts, "create").mockRejectedValue(new Error("DB error"));

    await expect(mutations.createAccount({}, { input: validInput })).rejects.toThrow("Error al crear la cuenta");
  });
});