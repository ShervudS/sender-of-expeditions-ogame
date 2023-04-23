import { Page } from "puppeteer";
import { sendMessageBot } from "../../../bot";

export const getTimeout = async (page: Page) => {
  await page
    .waitForSelector("ul#menuTable>li>span.menu_icon>a>div.fleet1")
    .then((value) => value?.click());
  await new Promise((r) => setTimeout(r, 1000));

  // === open feelt ctatus
  // await Promise.all([
  //   page.click("div.fleetStatus>div#movements>a"),
  //   page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  // ]);

  const firstExpeditionTimeEnd = await page.$eval(
    "div#inhalt>div.fleetDetails",
    (div) => Number(div?.getAttribute("data-arrival-time") || 0)
  );

  sendMessageBot(
    `Ближайшее окончание экспедиии: ${new Date(
      firstExpeditionTimeEnd * 1000
    ).toISOString()}`
  );

  return firstExpeditionTimeEnd * 1000 - Date.now();
};
