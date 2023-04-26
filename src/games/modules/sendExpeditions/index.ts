import { Page } from "puppeteer";
import { sendMessageBot } from "../../../bot";
import { expedetionConig } from "../../../configs/config";

const getAmountExpedition = async (page: Page) => {
  console.log("Check amount expeditions");
  return await page.$eval(
    "div.fleetStatus>div#slots>div.fleft:last-child>span",
    (span) => span?.textContent?.split(":")[1].trim().split("/")
  );
};

const sendExpedition = async (page: Page) => {
  console.log("Send");
  await page
    ?.waitForSelector("form#shipsChosen")
    .then(async () => {
      // Проверяем есть ли конфиг
      if (Object.keys(expedetionConig).length) {
        // Добавляем боевые коробли
        for (let ship in expedetionConig!.battleShips) {
          const input = await page.$(`ul#military>li.${ship}>input`);
          if (input) {
            await input.type(`${expedetionConig.battleShips[ship]}`, {
              delay: 100,
            });
          }
        }

        // Добавляем коробли
        for (let ship in expedetionConig!.civil) {
          const input = await page.$(`ul#civil>li.${ship}>input`);
          if (input) {
            await input.type(`${expedetionConig.civil[ship]}`, {
              delay: 100,
            });
          }
        }
      }
    })
    .then(async () => {
      await page.click("div#allornone a#continueToFleet2");
    });

  await page.waitForSelector("div#fleetboxdestination").then(async () => {
    await new Promise((r) => setTimeout(r, 2000));

    await page
      .waitForSelector("div.coords>input#position")
      .then(async (input) => {
        await input?.focus();
        await input?.type("99");
      });

    await new Promise((r) => setTimeout(r, 3000));

    await page
      .waitForSelector("div#naviActions>a#sendFleet")
      .then((value) => value?.click())
      .then(() => {
        sendMessageBot(`Экспедиция отправлена: ${new Date().toTimeString()}`);
      })
      .catch(() => {
        console.log("Ошибка при отправке");
      });

    await page.waitForNavigation();
  });
};

export const sendExpeditions = async (page: Page) => {
  console.log("SendExpeditions");

  await Promise.all([
    page
      .waitForSelector(
        "ul#menuTable>li>a[href='https://s186-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch']"
      )
      .then((value) => value?.click()),
    page.waitForSelector("div.fleetStatus>div#slots"),
  ]);

  const expeditionCounter = (await getAmountExpedition(page)) || [];
  if (expeditionCounter.length && expeditionCounter[0] < expeditionCounter[1]) {
    let amountExpedionon =
      Number(expeditionCounter[1]) - Number(expeditionCounter[0]);
    for (let i = 0; i < amountExpedionon; i++) {
      await sendExpedition(page);
    }
  }
};
