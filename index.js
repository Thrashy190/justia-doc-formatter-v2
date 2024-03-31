import puppeteer from "puppeteer";
// import dotenv from "dotenv";

(async () => {

    const urls = []


    const browser = await puppeteer.launch({
        devtools: false,
        // headless: false,
        args: [
        "--disable-infobars",
        "--no-first-run",
        "--no-sandbox",
        process.env.NODE_ENV === "production" ? "--kiosk" : null,
        ].filter((x) => x),
    });
    const page = await browser.newPage();

    // await page.setViewport({ width: 1800, height: 1100 });

    function delay(timeout) {
        return new Promise((resolve) => {
        setTimeout(resolve, timeout);
        });
    }

    for (let index = 0; index < urls.length; index++) {
        
        await page.goto(urls[index]);
        console.log("Page open")

        console.log("Wait 2 seconds for the file to load");
        await delay(2000);

        await page.click("#docs-file-menu");

        console.log("Saving as a DOCX");
        await delay(1000);

        for (let step = 0; step < 2; step++) {
          await page.keyboard.press("ArrowDown");
          await delay(500);
        }
        await page.keyboard.press("ArrowRight");

        await page.keyboard.press(String.fromCharCode(13));

        await delay(5000);

        
        
        console.log("Page download succesfully -"+index)
    }
    await page.close(); 
    await browser.close();
})();
