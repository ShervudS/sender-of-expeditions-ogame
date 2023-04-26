import { Page } from "puppeteer";

export const selectServer = async (page: Page) => {
  console.log("Select game server");
  await page.waitForSelector("section#myAccounts").then(async () => {
    // enter to the server
    const reactTabler = await page.$$(
      "#accountlist>.ReactTable div.rt-tr-group button[type='button']"
    );
    reactTabler[0].click();
  });
};
