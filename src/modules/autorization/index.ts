import { Page } from "puppeteer";
import "dotenv/config.js";

export const autorization = async (page: Page) => {
  // open tab for login
  await page
    .waitForSelector("div#loginRegisterTabs > ul.tabsList > li:first-child")
    .then((value) => value?.click());

  // Enter user email
  await page
    .waitForSelector("input[type='email']")
    .then((value) => value?.type(process.env.USER_MAIL as string));

  // enter user password
  await page
    .waitForSelector("input[type='password']")
    .then((value) => value?.type(process.env.USER_PASSWORD as string));

  // click for button sumbit
  await page
    .waitForSelector("button[type='submit']")
    .then((value) => value?.click());

  // wait for reload page
  await page.waitForNavigation();

  // go to the game
  await Promise.all([
    page.click("#joinGame .button"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  return;
};
