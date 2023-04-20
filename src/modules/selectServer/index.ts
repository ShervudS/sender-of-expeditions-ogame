import { Page } from "puppeteer";

export const selectServer = async (page: Page) => {
  // enter to the server
  const reactTabler = await page.$$(
    "#accountlist>.ReactTable div.rt-tr-group button[type='button']"
  );
  reactTabler[0].click();
};
