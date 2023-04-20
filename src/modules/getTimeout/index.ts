import { Page } from "puppeteer";

export const getTimeout = async (page: Page) => {
  await page
    .waitForSelector(
      'ul#menuTable a[href="https://s186-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch"]'
    )
    .then((value) => value?.click());
  await new Promise((r) => setTimeout(r, 1000));

  // === open feelt ctatus
  await Promise.all([
    page.click("div.fleetStatus>div#movements>a"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  const firstExpeditionTimeEnd = await page.$eval(
    "div#inhalt>div.fleetDetails",
    (div) => Number(div?.getAttribute("data-arrival-time") || 0)
  );

  console.log("firstExpeditionTimeEnd >>", firstExpeditionTimeEnd);

  //@ts-ignore
  const time = new Date(firstExpeditionTimeEnd * 1000);
  console.log("time>>>>", time.toLocaleTimeString());
};
