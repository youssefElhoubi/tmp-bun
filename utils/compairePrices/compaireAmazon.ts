import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

Puppeteer.use(StealthPlugin());

const compareAmazon = async (title) => {
    const browser = await Puppeteer.launch({
        headless: true, // this line only for debuging if the data is not scraped 
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--proxy-server=38.154.227.167:5868"
        ]
    });

    try {
        const page = await browser.newPage();

        // Authenticate if proxy requires credentials
        await page.authenticate({
            username: "cptjffkd",
            password: "f0i56dktc42r",
        });

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

        // Navigate to Amazon
        await page.goto("https://www.amazon.com/", { waitUntil: "networkidle2", timeout: 90000 });

        // Perform search
        await page.locator("#twotabsearchtextbox").fill(title);
        await page.locator("#nav-search-submit-button").click();
        await page.waitForSelector("[data-cy='title-recipe'] h2 span", { timeout: 10000 });

        // Scrape product data with error handling
        let productTitle, productImage, productPrice;

        try {
            productTitle = await page.$eval("[data-cy='title-recipe'] h2 span", el => el.innerText.trim());
        } catch {
            return JSON.stringify({ error: "Product title is missing", code: 404 });
        }

        try {
            productImage = await page.$eval(".s-image", el => el.src);
        } catch {
            return JSON.stringify({ error: "Product image is missing", code: 404 });
        }

        try {
            productPrice = await page.$eval(".a-price .a-offscreen", el => el.innerText.trim());
        } catch {
            return JSON.stringify({ error: "Product price is missing", code: 404 });
        }

        // Format response
        const productInfo = {
            success: true,
            code: 200,
            data: { productTitle, productImage, price: productPrice, platformName: "Amazon" }
        };

        return JSON.stringify(productInfo);
    } catch (error) {
        return JSON.stringify({ error: error.message, code: 500 });
    } finally {
        if (browser) await browser.close();
    }
};

// compareAmazon(process.argv[2]);

export default compareAmazon;
