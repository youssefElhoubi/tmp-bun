import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

Puppeteer.use(StealthPlugin());

const compareEbay = async (title) => {
    const browser = await Puppeteer.launch({
        headless: true, // this line only for debuging if the data is not scraped 
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            // "--proxy-server=38.154.227.167:5868",
        ]
    });

    try {
        const page = await browser.newPage();

        // Set a realistic User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        );

        // Set extra headers to avoid bot detection
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/",
            "Upgrade-Insecure-Requests": "1",
            "DNT": "1",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        });

        // Authenticate if proxy requires credentials
        // await page.authenticate({
        //     username: "cptjffkd",
        //     password: "f0i56dktc42r", 
        // });

        // Open eBay
        await page.goto("https://www.ebay.com", { waitUntil: "networkidle2", timeout: 90000 });

        // Perform search
        await page.locator("#gh-ac").fill(title);
        await page.locator("#gh-search-btn").click();
        await page.waitForSelector(".srp-river-results.clearfix");

        // Scrape product data with error handling
        let productTitle, productImage, productPrice;

        try {
            productTitle = await page.$eval("ul>li.s-item.s-item__pl-on-bottom .s-item__title", (el) => el.innerText.trim());
        } catch {
            return JSON.stringify({ error: "Product title is missing", code: 404 });
        }

        try {
            productImage = await page.$eval("ul>li.s-item.s-item__pl-on-bottom img", (el) => el.src);
        } catch {
            return JSON.stringify({ error: "Product image is missing", code: 404 });
        }

        try {
            productPrice = await page.$eval("ul>li.s-item.s-item__pl-on-bottom .s-item__price", (el) => el.innerText.split("$")[1].trim());
        } catch {
            return JSON.stringify({ error: "Product price is missing", code: 404 });
        }

        // Format response
        const productInfo = {
            success: true,
            code: 200,
            data: { productTitle, productImage, price: productPrice, platformName: "eBay" }
        };

        return JSON.stringify(productInfo);

    } catch (error) {
        return JSON.stringify({ error: error.message, code: 500 });
    } finally {
        if (browser) await browser.close();
    }
};
// compareEbay(process.argv[2]);
export default compareEbay;