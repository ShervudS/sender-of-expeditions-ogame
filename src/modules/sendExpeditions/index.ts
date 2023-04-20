import { readFileSync } from "fs";
import { Page } from "puppeteer";

const getAmountExpedition = async (page: Page) => {
  return await page.$eval(
    "div.fleetStatus>div#slots>div.fleft:last-child>span",
    (span) => span?.textContent?.split(":")[1].trim().split("/")
  );
};

const sendExpedition = async (page: Page) => {
  const expiditionConig: any = JSON.parse(
    readFileSync("./config.json", "utf8")
  );

  if (Object.keys(expiditionConig).length) {
    Object.keys(expiditionConig!.battleShips).forEach(async (ship) => {
      await page
        .waitForSelector(`ul#military>li.${ship}>input`)
        .then((value) => {
          page.keyboard.press("Backspace");
          value?.type(`${expiditionConig.battleShips[ship]}`);
        })
        .catch(() => console.log("Отсутствуют корабли для отправки"));
    });

    await new Promise((r) => setTimeout(r, 1000));
    Object.keys(expiditionConig!.civil).forEach(async (ship) => {
      await page
        .waitForSelector(`ul#civil>li.${ship}>input`)
        .then((value) => {
          page.keyboard.press("Backspace");
          value?.type(`${expiditionConig.civil[ship]}`);
        })
        .catch(() => console.log("Отсутствуют корабли для отправки"));
    });

    await new Promise((r) => setTimeout(r, 500));
    await page
      .waitForSelector("div#allornone a#continueToFleet2")
      .then((value) => value?.click());

    await new Promise((r) => setTimeout(r, 1000));
    await page
      .waitForSelector("div.coords>input#position")
      .then((value) => value?.type("16"));

    await new Promise((r) => setTimeout(r, 1000));

    await page
      .waitForSelector("div#naviActions>a#sendFleet")
      .then((value) => value?.click());
  }
};

export const sendExpeditions = async (page: Page) => {
  await Promise.all([
    page
      .waitForSelector(
        'ul#menuTable a[href="https://s186-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch"]'
      )
      .then((value) => value?.click()),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  const amountAvailableExpedition = (await getAmountExpedition(page)) || [];

  if (
    amountAvailableExpedition.length &&
    amountAvailableExpedition[0] < amountAvailableExpedition[1]
  ) {
    for (let i = 0; i < Number(amountAvailableExpedition[1]); i++) {
      await sendExpedition(page);
      console.log("send expedionon ", i + 1);
    }
  }
};
