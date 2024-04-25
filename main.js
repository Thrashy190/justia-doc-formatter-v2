/**
 *  JWEB JUSTIA AUTO PUBISH SITES
 *  Script to automate the publishing process of Justia's legacy sites (jweb)
 *
 *  Last modified: 2023-06-21
 *  By: Fernando-VR
 *
 */

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";

import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

puppeteer.use(StealthPlugin());

// Start Puppeteer
(async () => {
  // Auth with Google Sheets
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  // ID from Google Sheets document [ after /d/ in the URL ]

  // const spreadsheetId = '1sj5T9MnUk_MzeBkBmaYabPWmxGRnKepa8TF3iriq_Qs'; // Test Google Sheets
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Set the ROW where the script is going to start
  const row = parseInt(process.env.ROW_START);
  // Set the ROW where the script is going to finish
  const rowEnd = parseInt(process.env.ROW_END);
  // Set the name of the Sheet
  const sheetName = process.env.SPREADSHEET_NAME;

  // Read rows of properties from spreadsheet
  const getProperties = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `${sheetName}!H${row}:H${rowEnd}`,
  });

  // Filter the properties for each page
  const properties = getProperties.data.values.map((property) => property[0]);
  console.log(`Properties:\n`);
  console.log(properties);
  console.log(`\nThere are: ${properties.length} properties\n`);

  /**
   *  Starting Puppeteer
   */

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    executablePath: "/opt/homebrew/bin/chromium",
    headless: false,
    excludeSwitches: "enable-automation",
    ignoreDefaultArgs: [
      "--enable-automation",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-component-extensions-with-background-pages",
    ],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Create a new page on chromium
  const page = await browser.newPage();
  // Put the pages in an array
  const pages = await browser.pages();
  // Close the new tab that chromium always opens first.
  pages[0].close();

  // Setting variables
  let errorPages = [];

  /**
   * Iterating the data.
   */

  for (
    let propertyIndex = 0;
    propertyIndex < properties.length;
    propertyIndex++
  ) {
    // Wait 60s
    try {
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } catch (error) {
      errorString = "An error occurred waiting 60s";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    try {
      // Go to url Google Search Console
      await page.goto(
        "https://jweb.justia.com/reg/signin?_return_uri=http%3A%2F%2Fjweb.justia.com%2Fscripts%2Fsite",
        {
          waitUntil: "networkidle0",
          // Remove the timeout
          timeout: 0,
        }
      );
      await page.waitForTimeout(2000);
      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);
    } catch (error) {
      console.log("An Error ocurred trying to go to the link page");
      console.log(error);
      await page.goto(
        "https://jweb.justia.com/reg/signin?_return_uri=http%3A%2F%2Fjweb.justia.com%2Fscripts%2Fsite",
        {
          waitUntil: "networkidle0",
          // Remove the timeout
          timeout: 0,
        }
      );
      await page.waitForTimeout(2000);
      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);
    }

    // How to access to each property
    console.log(`\Property:  ${properties[propertyIndex]}`);

    // Set variables
    let errorString = "";

    /**
     *  Start Process
     */

    // Login with JWeb
    const userName = process.env.USER_NAME;
    const password = process.env.PASSWORD;

    // Filling the email field
    await page.waitForSelector("#username");
    await page.type('input[type="text"]', userName, { delay: 30 });
    await page.waitForTimeout(500);

    // Filling the password field
    await page.waitForSelector("#password");
    await page.type('input[type="password"]', password, { delay: 30 });
    await page.waitForTimeout(500);

    // Click for Login!
    await page.waitForSelector('input[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click('input[type="submit"]'),
    ]);
    await page.waitForTimeout(2000);

    // Select the property in the [ Existing Custom Web sites ] dropdown list.
    try {
      // Filling the password field
      await page.waitForSelector("#select_site > input[type=text]");
      await page.type('input[name="query"]', properties[propertyIndex], {
        delay: 30,
      });
      await page.waitForTimeout(1500);
    } catch (error) {
      errorString = "An error occurred filling the property name.";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    const dropdownList = await page.$$(
      "#custom_site_id_wrapper > select > option"
    );
    let flag = false;

    // Searching in the dropdown list
    for (let index = 0; index < dropdownList.length; index++) {
      let propertyName = await (
        await dropdownList[index].getProperty("innerText")
      ).jsonValue();
      if (propertyName == " " + properties[propertyIndex] + " ") {
        console.log(
          `[ ${
            row + propertyIndex
          } ] ------ ${propertyName}  [ ${propertyIndex} ]`
        );
        flag = true;
        break;
      }
    }
    if (!flag) {
      errorString = "Property not founded";
      console.log(errorString);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    // Click on the "EDIT SITE"
    try {
      await page.waitForSelector('input[value="Edit Site"]');
      const editButton = await page.$$('input[value="Edit Site"]');
      console.log(`Edit site lenght => ${editButton.length}`);
      if (editButton.length === 2) {
        await editButton[1].click();
        await page.waitForNavigation();
        await page.waitForTimeout(2500);
      } else {
        errorString = "An error occurred clicking on Edit Site.";
        console.log(errorString);
        await debugError(
          properties,
          googleSheets,
          propertyIndex,
          row,
          errorString,
          errorPages,
          auth,
          spreadsheetId,
          sheetName
        );
        continue;
      }
    } catch (error) {
      errorString = "An error occurred clicking on Edit Site.";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    /**
     *  Check If the site is being used by any other user
     */
    try {
      const errorDiv = await page.$(".error");
      if (errorDiv) {
        let errorMessage =
          "Did you forget to log out? Our records indicate the Website";
        const errorValue = await page.$eval(".error", (div) => div.textContent);
        if (errorValue.includes(errorMessage)) {
          /**
           *  Write the NOTE in googleSheets
           */

          console.log("Error:", errorValue);
          errorString = "The site is being used by any other user.";
          console.log(errorString);
          await debugError(
            properties,
            googleSheets,
            propertyIndex,
            row,
            errorString,
            errorPages,
            auth,
            spreadsheetId,
            sheetName
          );
          continue;
        }
        // Click on Logout Button
        await page.waitForSelector('a[href="/scripts/logout"]');
        const logoutButton = await page.$('a[href="/scripts/logout"]');
        if (logoutButton) {
          await logoutButton.click();
          await page.waitForNavigation();
          await page.waitForTimeout(2500);
          continue;
        } else {
          errorString = "An error occurred trying to do the logout";
          console.log(errorString);
          await debugError(
            properties,
            googleSheets,
            propertyIndex,
            row,
            errorString,
            errorPages,
            auth,
            spreadsheetId,
            sheetName
          );
          continue;
        }
      } else {
        console.log("[ - ] ------ No mistake ----- [ - ]");
      }
    } catch (error) {
      errorString = "The site is being used by any other user.";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    /**
     *  Check that the site is not on “Staging”
     */

    try {
      // Ckeck is the "Staging" tag exists
      await page.waitForSelector("strong");
      const dropdownList = await page.$$("strong");
      console.log(`dropdown list => ${dropdownList.length}`);

      let flagStaging = false;
      for (let index = 0; index < dropdownList.length; index++) {
        let strongText = await (
          await dropdownList[index].getProperty("innerText")
        ).jsonValue();
        if (strongText == "STAGING") {
          console.log(strongText);

          console.log("This property has te STAGING status");
          errorString = 'Site in "Staging"';
          console.log(errorString);
          await debugError(
            properties,
            googleSheets,
            propertyIndex,
            row,
            errorString,
            errorPages,
            auth,
            spreadsheetId,
            sheetName
          );
          flagStaging = true;

          // Click on Logout Button
          await page.waitForSelector('a[href="/scripts/logout"]');
          const logoutButton = await page.$('a[href="/scripts/logout"]');
          if (logoutButton) {
            await logoutButton.click();
            await page.waitForNavigation();
            await page.waitForTimeout(2500);
            break;
          } else {
            errorString = "An error occurred trying to do the logout";
            console.log(errorString);
            await debugError(
              properties,
              googleSheets,
              propertyIndex,
              row,
              errorString,
              errorPages,
              auth,
              spreadsheetId,
              sheetName
            );
            break;
          }
        }
      }
      if (flagStaging) continue;
    } catch (error) {
      errorString = "An error occurred trying to find the Staging Message.";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    /**
     *  Click “Preview & Publish”
     */
    try {
      await page.waitForSelector(".biggraybtn");
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click(".biggraybtn"),
      ]);
      await page.waitForTimeout(4000);
    } catch (error) {
      errorString = "An error occurred Clicking on Preview & Publish button.";
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      console.log(errorString);
      console.log(error);
      continue;
    }

    // Click on "PUBLISH" button
    try {
      await page.waitForSelector('input[value="Publish"]');
      const publishButton = await page.$$('input[value="Publish"]');
      console.log(`Publish lenght => ${publishButton.length}`);
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click('input[value="Publish"]'),
      ]);
      await page.waitForTimeout(1500);
    } catch (error) {
      errorString = "An error occurred Clicking on Publish button.";
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      console.log(errorString);
      continue;
    }

    /**
     *  Verify that the Site has been published
     */

    let validateMessage = "Your Site has been published.";
    try {
      const Message = await page.$eval(
        "#ccontainer > div > div > h3",
        (h3) => h3.textContent
      );
      if (validateMessage == Message) {
        // Write the NOTE in googleSheets
        console.log("Message:", Message);
        // Check for Status [ B ]
        const getStatus = await googleSheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: `${sheetName}!X${propertyIndex + row}`,
        });
        // Write row(s) to spreadsheet
        if (!getStatus.data.values) {
          try {
            await googleSheets.spreadsheets.values.append({
              auth,
              spreadsheetId,
              range: `${sheetName}!X${propertyIndex + row}`,
              valueInputOption: "USER_ENTERED",
              resource: {
                values: [["Done"]],
              },
            });
            console.log(`[✓]\tReport was saved successfully on spreadsheet\n`);
            await new Promise((resolve) => setTimeout(resolve, 1100));
          } catch (error) {
            errorString = "An error occurred while trying to write the status";
            await debugError(
              properties,
              googleSheets,
              propertyIndex,
              row,
              errorString,
              errorPages,
              auth,
              spreadsheetId,
              sheetName
            );
            console.log(errorString);
            continue;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1100));
          console.log(`[X]\t${properties[propertyIndex]}:`);
          console.log(
            `\tThis fields contains:  '${getStatus.data.values}' and were not overwritten\n`
          );
          continue;
        }
      } else {
        // Error pubishing the site
        errorString = "An error occurred trying to publish the site.";
        await debugError(
          properties,
          googleSheets,
          propertyIndex,
          row,
          errorString,
          errorPages,
          auth,
          spreadsheetId,
          sheetName
        );
        console.log(errorString);
        continue;
      }
    } catch (error) {
      errorString = "An error occurred trying to publish the site";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }

    // Click on Logout Button
    try {
      await page.waitForSelector('a[href="/scripts/logout"]');
      const logoutButton = await page.$('a[href="/scripts/logout"]');
      if (logoutButton) {
        await logoutButton.click();
        await page.waitForNavigation();
        await page.waitForTimeout(2500);
        continue;
      } else {
        errorString = "An error occurred trying to publish the site";
        console.log(errorString);
        await debugError(
          properties,
          googleSheets,
          propertyIndex,
          row,
          errorString,
          errorPages,
          auth,
          spreadsheetId,
          sheetName
        );
        continue;
      }
    } catch (error) {
      errorString = "An error occurred trying to click on Logout Button";
      console.log(errorString);
      console.log(error);
      await debugError(
        properties,
        googleSheets,
        propertyIndex,
        row,
        errorString,
        errorPages,
        auth,
        spreadsheetId,
        sheetName
      );
      continue;
    }
  }

  console.log("\nError pages:\n");
  console.log(errorPages);
})();

const debugError = async (
  properties,
  googleSheets,
  propertyIndex,
  row,
  error,
  errorPages,
  auth,
  spreadsheetId,
  sheetName
) => {
  // Check for Search Console property name, Search Console property type and URL
  const getNotesValidation = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `${sheetName}!X${propertyIndex + row}`,
  });

  // Write Notes to spreadsheet
  if (!getNotesValidation.data.values) {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${sheetName}!X${propertyIndex + row}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[`${error}`]],
      },
    });
    console.log(
      `[X]\t${properties[propertyIndex]} with index: ${propertyIndex} -> ${error}\n`
    );
    console.log(`\tA note was written in Google Sheets successfully\n`);
    errorPages.push([properties[propertyIndex], propertyIndex]);
    return -1;
  } else {
    console.log(
      `[X]\t${properties[propertyIndex]} with index: ${[
        propertyIndex,
      ]} -> ${error}\n`
    );
    console.log(
      `\tThis fields contains the following NOTE:  '${getNotesValidation.data.values}' and were not overwritten\n`
    );
    errorPages.push([properties[propertyIndex], propertyIndex]);
    return -1;
  }
};
