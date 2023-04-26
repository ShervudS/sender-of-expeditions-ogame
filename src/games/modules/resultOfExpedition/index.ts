import { Page } from "puppeteer";
import { sendMessageBot } from "../../../bot";

export const sendResultExpeditions = async (page: Page) => {
  console.log("Send result expeditions");
  await Promise.all([
    page
      .waitForSelector("div#notificationbarcomponent a.comm_menu.messages")
      .then((value) => value?.click()),
    page.waitForNavigation({ waitUntil: "load" }),
  ]);

  await page
    .waitForSelector("div#fleetsTab ul.subtabs>li#subtabs-nfFleet22>a")
    .then((value) => value?.click());

  await new Promise((r) => setTimeout(r, 1000));

  const messages = await page.$$eval(
    "div#fleetsgenericpage>ul.tab_inner li.msg ",
    (messages) =>
      messages.map(
        (message) => message.querySelector("span.msg_content")?.textContent
      )
  );

  messages.forEach((message) => {
    if (message) {
      sendMessageBot(message);
    }
  });

  await page
    .waitForSelector(
      "div#fleetsTab ul.subtabs>li#subtabs-nfFleetTrash>div.trash_box>span.not_in_trash"
    )
    .then((value) => value?.click());
};
