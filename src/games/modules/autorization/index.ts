import { Page } from "puppeteer";
import "dotenv/config.js";

export const autorization = async (page: Page) => {
  console.log("Autorization");
  // open tab for login
  await page
    .waitForSelector("div#loginRegisterTabs>ul.tabsList>li:first-child")
    .then((value) => value?.click());

  await page.waitForSelector("div#loginTab");

  // Enter user email
  await page?.type("input[type='email']", process.env.USER_MAIL as string);

  // enter user password
  await page?.type(
    "input[type='password']",
    process.env.USER_PASSWORD as string
  );

  await page.mainFrame().click("form#loginForm>p>button[type='submit']");
};
