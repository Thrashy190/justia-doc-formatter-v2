// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import puppeteer from "puppeteer-extra";

// import { google } from "googleapis";
// import dotenv from "dotenv";

// dotenv.config();

// puppeteer.use(StealthPlugin());

// (async () => {
//   // Auth with Google Sheets
//   const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });

//   // Create client instance for auth
//   const client = await auth.getClient();

//   // Instance of Google Sheets API
//   const googleSheets = google.sheets({
//     version: "v4",
//     auth: client,
//   });

//   // ID from Google Sheets document [ after /d/ in the URL ]

//   // const spreadsheetId = '1sj5T9MnUk_MzeBkBmaYabPWmxGRnKepa8TF3iriq_Qs'; // Test Google Sheets
//   const spreadsheetId = process.env.SPREADSHEET_ID;

//   // Set the ROW where the script is going to start
//   const row = parseInt(process.env.ROW_START);
//   // Set the ROW where the script is going to finish
//   const rowEnd = parseInt(process.env.ROW_END);
//   // Set the name of the Sheet
//   const sheetName = process.env.SPREADSHEET_NAME;

//   // Read rows of properties from spreadsheet
//   const getProperties = await googleSheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId,
//     range: `${sheetName}!H${row}:H${rowEnd}`,
//   });

//   // Filter the properties for each page
//   const properties = getProperties.data.values.map((property) => property[0]);
//   console.log(`Properties:\n`);
//   console.log(properties);
//   console.log(`\nThere are: ${properties.length} properties\n`);

// })();

import * as path from "path";
import process from "process";
import fs from "fs/promises";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

const auth = await authorize();

/**
 * Prints the selected jweb id:
 * @see https://docs.google.com/spreadsheets/d/1cwMU7Uv3yta5pVuiEutV74fRVdFyNFkM1wtR4ANfCMk/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function searchJwebSiteName(rows, domain) {
  console.log(domain);
  rows.forEach((row) => {
    if (row[0] == domain) {
      return row[2];
    }
  });
}

async function getCFIDfromSpreadSheet() {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1BABuybbevzlDjMlCO4AhI_PAfBB_NYbiLmCjejKaXUI",
    range: "A1:R271",
  });

  const resID = await sheets.spreadsheets.values.get({
    spreadsheetId: "1cwMU7Uv3yta5pVuiEutV74fRVdFyNFkM1wtR4ANfCMk",
    range: "B2:D1125",
  });

  const rowsID = resID.data.values;
  if (!rowsID || rowsID.length === 0) {
    console.log("No data found.");
    return;
  }

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  rows.forEach(async (row) => {
    if (row[16] !== "-") {
      let id = searchJwebSiteName(rowsID, row[0]);
      console.log(`${row[0]}, ${row[16]}, ${id}`);
    }
  });
}

authorize().then(getCFIDfromSpreadSheet).catch(console.error);
