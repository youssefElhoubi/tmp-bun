import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

interface ProductInfo {
    success: boolean;
    code: number;
    data?: {
        productTitle: string;
        productImage: string;
        price: string;
        platformName: string;
    };
    error?: string;
}

const compareAmazon = async (title: string): Promise<ProductInfo> => {
    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless: true, // set false if debugging
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--proxy-server=38.154.227.167:5868"
            ]
        });

        const page: Page = await browser.newPage();

        // Proxy authentication
        await page.authenticate({
            username: "cptjffkd",
            password: "f0i56dktc42r",
        });

        // Realistic User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        );

        // Extra headers
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
        await page.goto("https://www.amazon.com/", {
            waitUntil: "networkidle2",
            timeout: 90000,
        });

        // Search for the product
        await page.locator("#twotabsearchtextbox").fill(title);
        await page.locator("#nav-search-submit-button").click();
        await page.waitForSelector("[data-cy='title-recipe'] h2 span", { timeout: 10000 });

        // Scrape data
        const productTitle: string = await page.$eval(
            "[data-cy='title-recipe'] h2 span",
            (el) => (el as HTMLElement).innerText.trim()
        );

        const productImage: string = await page.$eval(
            ".s-image",
            (el) => (el as HTMLImageElement).src
        );

        const productPrice: string = await page.$eval(
            ".a-price .a-offscreen",
            (el) => (el as HTMLElement).innerText.trim()
        );

        return {
            success: true,
            code: 200,
            data: { productTitle, productImage, price: productPrice, platformName: "Amazon" }
        };
    } catch (error: any) {
        return { success: false, code: 500, error: error.message };
    } finally {
        if (browser) await browser.close();
    }
};


export default compareAmazon;
