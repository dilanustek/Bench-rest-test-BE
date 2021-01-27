const { rest } = require("msw");

module.exports.handlers = [
  rest.get(`https://resttest.bench.co/transactions/1.json`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalCount: 5,
        transactions: [
          {
            Ledger: "TestLedger",
            Company: "TestCompany",
            Date: "20-10-2021",
            Amount: "10",
          },
          {
            Ledger: "TestLedger2",
            Company: "TestCompany2",
            Date: "20-9-2021",
            Amount: "-2.5",
          },
        ],
      })
    );
  }),
  rest.get(`https://resttest.bench.co/transactions/2.json`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalCount: 5,
        transactions: [
          {
            Ledger: "TestLedger3",
            Company: "TestCompany3",
            Date: "20-9-2021",
            Amount: ".5",
          },
          {
            Ledger: "TestLedger4",
            Company: "TestCompany4",
            Date: "20-9-2021",
            Amount: "-1.5",
          },
        ],
      })
    );
  }),
  rest.get(`https://resttest.bench.co/transactions/3.json`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalCount: 5,
        transactions: [
          {
            Ledger: "TestLedger5",
            Company: "TestCompany5",
            Date: "20-8-2021",
            Amount: "3",
          },
        ],
      })
    );
  }),
];
