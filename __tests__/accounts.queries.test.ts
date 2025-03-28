import mongoose from "mongoose";
import { queries } from "../server/graphql/accounts/queries";
import Accounts from "../server/models/accounts";

describe("listAccounts Query", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should return accounts when called with valid filter and pagination", async () => {
    const fakeAccounts = [
      {
        id: "1",
        name: "Account A",
        email: "accounta@example.com",
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z"
      },
      {
        id: "2",
        name: "Account B",
        email: "accountb@example.com",
        createdAt: "2021-01-02T00:00:00.000Z",
        updatedAt: "2021-01-02T00:00:00.000Z"
      }
    ];

    const aggregateSpy = jest.spyOn(Accounts, "aggregate").mockResolvedValue(fakeAccounts as any);

    const result = await queries.listAccounts({}, { filter: { name: "Account" }, pagination: { page: 1, limit: 10 } });

    expect(aggregateSpy).toHaveBeenCalled();
    expect(result).toEqual(fakeAccounts);
  });

  test("should return accounts with default pagination when none provided", async () => {
    const fakeAccounts = [
      {
        id: "1",
        name: "Account A",
        email: "accounta@example.com",
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z"
      }
    ];

    const aggregateSpy = jest.spyOn(Accounts, "aggregate").mockResolvedValue(fakeAccounts as any);

    const result = await queries.listAccounts({}, {});

    expect(aggregateSpy).toHaveBeenCalled();
    expect(result).toEqual(fakeAccounts);
  });

  test("should throw error if Accounts.aggregate fails", async () => {
    const errorMessage = "Aggregation error";
    jest.spyOn(Accounts, "aggregate").mockRejectedValue(new Error(errorMessage));

    await expect(queries.listAccounts({}, {})).rejects.toThrow("Error al buscar las cuentas");
  });
});
