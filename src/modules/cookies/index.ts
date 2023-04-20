import { readFile, readFileSync, writeFile } from "fs";

export const getLocalCookie = async () => {
  try {
    const cookies = readFileSync("./cookies.json", {
      encoding: "utf8",
    });
    return JSON.parse(cookies);
  } catch (error) {
    console.log(error);
  }
};

export const saveCookies = async (cookies: any) => {
  writeFile("./cookies.json", JSON.stringify({ cookies }, null, 2), (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
};
