import puppeteer from "puppeteer";
// import dotenv from "dotenv";

(async () => {

    const urls = [
      "https://docs.google.com/document/d/1JiLzT3L9PB2T12ZK35191Yr5Jo_xcLoJ/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1tdruJlxttTZ-O3NLL_7cFKXdjcgO_XVZ/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/134RGFSBFoycv9iTS2aOzdWhlvx-u6KMC/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1QxqUlbLjiH7iSWmce6I_9sHMqxnrK7lE/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1FH8EyTsg584BrgmTPAMHQ4czMaicF1O8/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1Jt-KDHHUtOTnrKa1xemzE41OmQD2p014/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/10ZMEMjc2SbRb3qi8z5rGhE1RTh9MvLQW/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/18QXxsPc6m-ee7eYYDhC7LGk6lRcjN-hH/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1pnUcrbj8F4h59BUogDSu4kYERDdjglci/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1s_Hbt3cIZU1gOnI6hccm6KL5jFX8EAJJ/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1kDPKeROhuBr8ysLvG3NCoTvlu8PEKAt3/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1SInDIDz4IRLSZQ0QF5h1m9q1NjpAxnfZ/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1FlyZiiuVBv6jqM7mpLSA2PER_uLuDx5K/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1E_NdnPfb-pKrQuuQ5kXtg5soZDCKzi61/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1ozFJTUi2uDevkMgMHAK3pTy0GlSXsCqp/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1Hb7tET9WVfJhZkzZ9JONAOxeaq4nnl9O/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1I_K6EmHkPZqo5abeSmM9GrxwNB6Rf1G1/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1Akr8fOisW0EXUcJ-eTXI_bl3R-qX19yh/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1PSR1lB1eEMhjgeElVrVKYs_R_213Emvk/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1OQ41-NnvwiyUxqBwqIJbUK9lmCL9tOKu/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1eEcr-0lp8b5kdXtPFPDxNCgkYxqdv4JW/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1vOBc7J27a1h7m7ki68cxAylnTxonJBLL/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1kmF-EyvJBAoR2ynbAsymktmRG31soHCS/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1gprQ8vaHy_FJhTU7tDSVJaAaJIXkf6za/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/15-vkUalvLaZaWUdB3qBNrA921NkgM4xy/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/19tP4pPMfB3kXy0Tf-L2LQZlZNMxTBKob/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1CyzCOxbHprNLAvh3NvAKaPz-3Mw_zWq2/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1AcR_zwDKQyzvkYutEQ3VHh974wkGiJUD/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1eA_DQRGJgn-e98tc6Tsade2jiwMm0idi/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/15fzjT5mekACJU3EgU_kpNS09DsgbyrUe/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1sctkvdHLnzDA38Ui5vsc7i6n_7RolpJd/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1NGa3VJOKUteaxXQnF7Q8p2_nUKwkiFGl/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1tNGDb7RE8ORcdk9JoYefrCS1aybpsZO6/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/16kAj_ZqeSbz6Wl5q-2dEExad7DUkUMNv/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1ZCFAR8Iv1hbRfom1E7IXyFOyfEnWXuM_/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1t1-hlWtSmod_NmsAN-iNrTWhoqXbQYeT/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1wB4Sp2DuqyjdzVi5TEagd7Y7tLc1qCnf/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1qFiXJ_gKm5SHf9BrcL_1e0XfF0hYJ_Ln/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/143IwI5kmW87QVp6FuZWnn998ZhebSoJY/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1OuC4LaBwZRX7JWa2xc8_IctOEj5vfq5S/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1wQmvBrdD2y-o6pG4Faorbv16lXvR8-dV/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1OK_EvTBOe8p4kEQPWfN06XYCxo-e72RW/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1g0zAITG4xNh0A1AjZdod-Jii58wpkAyV/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1aYQPm6WHBkT6Y7qgg5zru7730P-BeRFr/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1MVX_zyXAqWfQNetgIKkVXGfKK70OMP0i/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1uGcrAeYptl3YlKPlGyMSpuGcZYxUL4Hg/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1nd39PIoGRfHMucHPqdahHdogMyDgS8P-/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1D1oa_Ym6BI8bgIo3FrmlZtJxWwIztQwO/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1exuUtHndfX9jg4HqMkyaCm2lmZZdG6mS/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/13OjvG4bAUhIMcZPsF1b-FbDmrNs1TZKG/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1Fx76qlSdd8UwOzFlKznM7tpf4T8GqUj_/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1JuHa3lZkzydS57XQ06HzO2iJZLKl_ZAW/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1PexQ3_UzfaXXbSBWJmd11IQcXi2fR6I8/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1EhfPO8yKdSE588kCWpYo9T0C2DktLLZr/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1B5akzDQT_Iktur3TYdZx2okkSRUrhhhp/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1A-p7VgBdLyHJQ6lZwWaKqlcdcB2Clkt_/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1B3LxkQq0O1JBv7mQJNMTkLYMmzXGKxIN/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1GbRY6p9SpXcNtFyx1tgFy5okVg4NvYgH/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1RrlX6Z9DdfFk9wnA4yMzE_7c0SsVPXyV/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1jzFyCzhzEqtetcjfxD-57MdLGFQeDEaO/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1nN6SnmsMUd61aUbKHi_WpeFD2x7I3JmU/edit?usp=drive_link&ouid=103613776220831494829&rtpof=true&sd=true",
    ];


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