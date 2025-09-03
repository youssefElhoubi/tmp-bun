import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

Puppeteer.use(StealthPlugin());

const compareNewEgg = async (title) => {
    const browser = await Puppeteer.launch({
        headless: true, // this line only for debuging if the data is not scraped 
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled"
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

        // Navigate to Newegg
        await page.goto("https://www.newegg.com", { waitUntil: "networkidle2", timeout: 90000 });

        // Perform search
        await page.locator(".header2021-search-box input").fill(title);
        await page.locator(".ico.ico-search").click();
        await page.waitForSelector(".item-cell .item-container .item-info .item-title");

        // Scrape product data with error handling
        let productTitle, productImage, productPrice;

        try {
            productTitle = await page.$eval(".item-cell .item-container .item-info .item-title", el => el.innerText.trim());
        } catch {
            console.error("❌ Product title not found.");
            return JSON.stringify({ error: "Product title is missing", code: 404 });
        }

        try {
            productImage = await page.$eval(".item-cell .item-container .item-img img", el => el.src);
        } catch {
            console.error("❌ Product image not found.");
            return JSON.stringify({ error: "Product image is missing", code: 404 });
        }

        try {
            const priceWhole = await page.$eval(".item-cell .item-container .price .price-current strong", el => el.innerText.trim());
            const priceFraction = await page.$eval(".item-cell .item-container .price .price-current sup", el => el.innerText.trim());
            productPrice = priceWhole + "." + priceFraction;
        } catch {
            console.error("❌ Product price not found.");
            return JSON.stringify({ error: "Product price is missing", code: 404 });
        }

        // Format response
        const productInfo = {
            success: true,
            code: 200,
            data: { productTitle, productImage, price: productPrice, platformName: "Newegg" }
        };

        return JSON.stringify(productInfo);
    } catch (error) {
        console.error("❌ Scraping Error:", error.message);
        return JSON.stringify({ error: error.message, code: 500 });
    } finally {
        if (browser) await browser.close();
    }
};

// compareNewEgg(process.argv[2]);

export default compareNewEgg;
