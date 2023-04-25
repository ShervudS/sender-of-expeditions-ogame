import puppeteer, { Browser } from "puppeteer";
import "dotenv/config.js";
import { autorization } from "./modules/autorization";
import { selectServer } from "./modules/selectServer";
import { getLocalCookie, saveCookies } from "./modules/cookies";
import { sendExpeditions } from "./modules/sendExpeditions";
import { getTimeout } from "./modules/getTimeout";
import { sendResultExpeditions } from "./modules/resultOfExpedition";

export const gameService = async () => {
  console.log("Start gameService");

  let browser: Browser | null = null;
  let timer: number = 0;

  try {
    browser =
      process.env.NODE_ENV === "dev"
        ? await puppeteer.launch({
            headless: false,
          })
        : await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.TOKEN}`,
          });

    const page = await browser.newPage();
    // Set screen size
    await page.setViewport({ width: 1280, height: 1500 });

    // TODO: сделать подстановку кук из файла и переход на сохраненную вкладку
    const { cookies } = await getLocalCookie();

    if (!cookies.length) {
      // === go to default autorization page
      await page.mainFrame().goto(process.env.O_GAME_SITE_URL as string, {
        waitUntil: "domcontentloaded",
      });

      // === autorization user ===
      await autorization(page);

      await page.waitForSelector("#joinGame").then(() => {
        page.click("#joinGame>a");
      });
    } else {
      // === set saved old cookies
      console.log("Set cookies");
      await page.setCookie(...cookies);

      // === go to saved game page
      console.log("Go to page");
      await page.mainFrame().goto(process.env.O_GAME_SITE_URL as string, {
        waitUntil: "domcontentloaded",
      });

      // go to the game
      console.log("Enter the game");
      const element = await page.waitForSelector("#joinGame>a");
      await page.evaluate((el) => el?.click(), element);
      // await page
      //   .waitForSelector()
      //   .then((value) => value?.click());
    }

    // === Choosing an user server ===
    await selectServer(page);

    // === Switch to new tab ===
    const pageTarget = page.target();
    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );
    const gamePage = await newTarget.page();
    await gamePage!.setViewport({ width: 1280, height: 1300 });
    await new Promise((r) => setTimeout(r, 3000));

    if (!cookies.length) {
      // === Принимаем сообщение о сохранении кук ===
      await gamePage!
        .waitForSelector("button.cookiebanner5")
        .then((value) => value?.click());
      await gamePage!
        .waitForSelector("button.cookiebanner5")
        .then((value) => value?.click());
    }

    await sendExpeditions(gamePage!);

    timer = await getTimeout(gamePage!);

    await sendResultExpeditions(gamePage!);

    // // ==== Save cookies before exit into file ===
    console.log("Save cookies");
    saveCookies(await page.cookies());
  } catch (err) {
    console.log(err);
    if (browser) {
      browser?.close();
    }
    return 0;
  } finally {
    if (browser && process.env.NODE_ENV !== "dev") {
      browser?.close();
    }
    return timer;
  }
};
