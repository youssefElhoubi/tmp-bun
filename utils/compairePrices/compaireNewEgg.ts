import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const compareNewEgg = async (title: string) => {
    const browser = await puppeteer.launch({
        headless: true, // set to false for debugging
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
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
        await page.goto("https://www.newegg.com", {
            waitUntil: "networkidle2",
            timeout: 90_000,
        });

        // Perform search (fixed: Puppeteer syntax)
        await page.type(".header2021-search-box input", title);
        await page.click(".ico.ico-search");
        await page.waitForSelector(".item-cell .item-container .item-info .item-title");

        // Scrape product data with error handling
        let productTitle: string;
        let productImage: string;
        let productPrice: string;

        try {
            productTitle = await page.$eval(
                ".item-cell .item-container .item-info .item-title",
                (el) => el.textContent?.trim() || ""
            );
        } catch {
            return { error: "Product title is missing", code: 404 };
        }

        try {
            productImage = await page.$eval(
                ".item-cell .item-container .item-img img",
                (el: HTMLImageElement) => el.src
            );
        } catch {
            return { error: "Product image is missing", code: 404 };
        }

        try {
            const priceWhole = await page.$eval(
                ".item-cell .item-container .price .price-current strong",
                (el) => el.textContent?.trim() || ""
            );
            const priceFraction = await page.$eval(
                ".item-cell .item-container .price .price-current sup",
                (el) => el.textContent?.trim() || "00"
            );
            productPrice = `${priceWhole}.${priceFraction}`;
        } catch {
            return { error: "Product price is missing", code: 404 };
        }

        // Format response
        return {
            success: true,
            code: 200,
            data: {
                productTitle,
                productImage,
                price: productPrice,
                platformName: "Newegg",
            },
        };
    } catch (error: any) {
        return { error: error.message, code: 500 };
    } finally {
        await browser.close();
    }
};

export default compareNewEgg;
