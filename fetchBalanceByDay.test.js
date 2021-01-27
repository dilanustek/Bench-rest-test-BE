const { fetchTransactions, logDailyBalances } = require("./fetchBalanceByDay");
const { server } = require("./mocks/server.js");
const { rest } = require("msw");

test("fetches 1 page of transactions", async () => {
  const { transactions, totalCount } = await fetchTransactions(1);
  expect(totalCount).toEqual(5);
  expect(transactions).toHaveLength(2);
  expect(transactions[0]).toEqual({
    Ledger: "TestLedger",
    Company: "TestCompany",
    Date: "20-10-2021",
    Amount: "10",
  });
});

test("logs daily balances", async () => {
  const spy = jest.spyOn(console, "log").mockImplementation();
  await logDailyBalances();

  expect(spy.mock.calls).toEqual([
    ["20-8-2021 -> 3"],
    ["20-9-2021 -> -0.5"],
    ["20-10-2021 -> 9.5"],
  ]);
  spy.mockRestore();
});

describe("server error", () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `https://resttest.bench.co/transactions/1.json`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );
  });

  test("fetchTransactions logs an error", async () => {
    await expect(fetchTransactions(1)).rejects.toThrow(
      "Unexpected server status: 500"
    );
  });

  test("logDailyBalances prints an error", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation();
    await logDailyBalances();
    expect(spy).toHaveBeenCalledWith(
      "Error: there is a problem with fetching",
      new Error("Unexpected server status: 500")
    );
  });
});
