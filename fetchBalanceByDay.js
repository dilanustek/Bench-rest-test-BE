/* We assume transactions are sorted and served from most to least recent.
 There is 1 transaction that is out of order. Let's assume that it is a bug that will be fixed on the API.
 We assume there are the same number of transactions in each page. */

const fetch = require("node-fetch");
let url = "https://resttest.bench.co/transactions/";

const printDateBalance = (date, balance) =>
  console.log(date + " -> " + balance);

const getUrl = (page) => url + page + ".json";

async function fetchTransactions(page) {
  const response = await fetch(getUrl(page));

  // anything other than 200 OK will throw an error
  if (response.status !== 200) {
    throw new Error("Unexpected server status: " + response.status);
  }

  const { transactions, totalCount } = await response.json();
  return { transactions, totalCount };
}

// Get the number of pages since data is served from most to least recent.
async function getNumberOfPages() {
  let { transactions, totalCount } = await fetchTransactions(1);
  return Math.floor(totalCount / transactions.length) + 1;
}

// Print running daily balance from least to most recent date
async function printDailyBalance() {
  let prevDate = "";
  let runningDailyBalance = 0;

  // sequentially fetch each page
  for (let page = await getNumberOfPages(); page > 0; page--) {
    let { transactions } = await fetchTransactions(page);

    if (transactions.length < 1) {
      throw new Error(" No transactions available.");
    }

    // this is the first date so set up prevDate
    if (prevDate === "") prevDate = transactions[transactions.length - 1].Date;

    for (let j = transactions.length - 1; j >= 0; j--) {
      const tr = transactions[j];
      const currentDate = tr.Date;

      // print when date changes
      if (currentDate !== prevDate) {
        printDateBalance(prevDate, runningDailyBalance / 100);
        prevDate = currentDate;
      }

      runningDailyBalance += Math.floor(parseFloat(tr.Amount) * 100);
    }

    // print the final ever transaction
    if (page === 1) {
      printDateBalance(prevDate, runningDailyBalance / 100);
    }
  }
}

printDailyBalance().catch((error) =>
  console.log("Error: there is a problem with fetching", error)
);
