import puppeteer from "puppeteer";
import "dotenv/config.js";
import { autorization } from "./modules/autorization";
import { selectServer } from "./modules/selectServer";
import { getLocalCookie, saveCookies } from "./modules/cookies";
import { sendExpeditions } from "./modules/sendExpeditions";
import { getTimeout } from "./modules/getTimeout";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Set screen size
  await page.setViewport({ width: 1280, height: 1024 });

  // TODO: сделать подстановку кук из файла и переход на сохраненную вкладку
  const { cookies } = await getLocalCookie();

  if (!cookies) {
    // === go to default autorization page
    await page.goto(process.env.O_GAME_SITE_URL as string);

    // === autorization user ===
    await autorization(page);
  } else {
    // === set saved old cookies
    await page.setCookie(...cookies);

    // === go to saved game page
    await page.goto(process.env.O_GAME_SITE_URL as string);
    await new Promise((r) => setTimeout(r, 3000));

    // go to the game
    await Promise.all([
      page.click("#joinGame .button"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
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

  if (!cookies) {
    // === Принимаем сообщение о сохранении кук ===
    await gamePage!
      .waitForSelector("button.cookiebanner5")
      .then((value) => value?.click());
    await gamePage!
      .waitForSelector("button.cookiebanner5")
      .then((value) => value?.click());
  }

  await sendExpeditions(gamePage!);

  await getTimeout(gamePage!);

  // // ==== Save cookies before exit into file ===
  saveCookies(await page.cookies());
})();
