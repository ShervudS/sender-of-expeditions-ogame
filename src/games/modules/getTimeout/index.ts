import { Page } from "puppeteer";
import { sendMessageBot } from "../../../bot";

export const getTimeout = async (page: Page) => {
  console.log("Get time to end first expedition");
  await page
    .waitForSelector("ul#menuTable>li>span.menu_icon>a>div.fleet1")
    .then((value) => value?.click());

  await page.waitForSelector("div#inhalt");

  const firstExpeditionTimeEnd = await page.$$eval(
    "div#inhalt>div.fleetDetails",
    (arrFleets) =>
      arrFleets.map((div) => Number(div?.getAttribute("data-arrival-time")))
  );

  const minTime = Math.min(...firstExpeditionTimeEnd);

  sendMessageBot(
    `Ближайшее окончание экспедиии: ${new Date(minTime * 1000).toTimeString()}`
  );

  return minTime * 1000;
};
