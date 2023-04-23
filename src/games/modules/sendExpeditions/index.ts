import { readFileSync } from "fs";
import { Page } from "puppeteer";
import { sendMessageBot } from "../../../bot";

const getAmountExpedition = async (page: Page) => {
  return await page.$eval(
    "div.fleetStatus>div#slots>div.fleft:last-child>span",
    (span) => span?.textContent?.split(":")[1].trim().split("/")
  );
};

const sendExpedition = async (page: Page, expiditionConig: any) => {
  if (Object.keys(expiditionConig).length) {
    Object.keys(expiditionConig!.battleShips).forEach(async (ship) => {
      await page
        .waitForSelector(`ul#military>li.${ship}>input`)
        .then(async (value) => {
          await value?.press("Backspace");
          await value?.type(`${expiditionConig.battleShips[ship]}`);
          await value?.press("Tab");
        })
        .catch(() => console.log("Отсутствуют корабли для отправки"));
    });
    await new Promise((r) => setTimeout(r, 1000));

    Object.keys(expiditionConig!.civil).forEach(async (ship) => {
      await page
        .waitForSelector(`ul#civil>li.${ship}>input`)
        .then(async (value) => {
          await value?.press("Backspace");
          await value?.type(`${expiditionConig.civil[ship]}`);
          await value?.press("Tab");
        })
        .catch(() => console.log("Отсутствуют корабли для отправки"));
    });

    await new Promise((r) => setTimeout(r, 500));
    await page
      .waitForSelector("div#allornone a#continueToFleet2")
      .then((value) => value?.click());

    await new Promise((r) => setTimeout(r, 1000));
    await page.waitForSelector("div.coords>input#position").then((value) => {
      value?.press("Backspace");
      value?.press("Backspace");
      value?.type("16");
    });

    await new Promise((r) => setTimeout(r, 1000));

    await Promise.all([
      page
        .waitForSelector("div#naviActions>a#sendFleet")
        .then((value) => value?.click()),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      sendMessageBot(`Экспедиция отправлена: ${new Date().toISOString()}`),
    ]);
  }
};

export const sendExpeditions = async (page: Page) => {
  await Promise.all([
    page
      .waitForSelector(
        "ul#menuTable>li>a[href='https://s186-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch']"
      )
      .then((value) => value?.click()),
    page.waitForNavigation({ waitUntil: "load" }),
  ]);

  const expeditionCounter = (await getAmountExpedition(page)) || [];
  if (expeditionCounter.length && expeditionCounter[0] < expeditionCounter[1]) {
    let amountExpedionon =
      Number(expeditionCounter[1]) - Number(expeditionCounter[0]);
    const expiditionConig: any = JSON.parse(
      readFileSync("./config.json", "utf8")
    );
    for (let i = 0; i < amountExpedionon; i++) {
      await sendExpedition(page, expiditionConig);
    }
  }
};
