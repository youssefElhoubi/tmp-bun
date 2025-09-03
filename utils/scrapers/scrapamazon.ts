import { Page,Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

interface ProductInfo {
    success: boolean;
    code: number;
    data?: {
        productTitle: string;
        holePrice: string;
        productImage: string;
        platformName: string;
    };
    error?: string;
}

const scrapAmazon = async (url: string): Promise<ProductInfo> => {
    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page: Page = await browser.newPage();

        // Set a realistic user-agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.120 Safari/537.36"
        );

        // Set extra headers to avoid bot detection
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
        });

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 90000,
        });

        // Scrape product title
        const productTitle: string = await page.$eval(
            ".product-title-word-break",
            (el) => (el as HTMLElement).innerText.trim()
        );

        // Scrape product price
        let holePrice: string = await page.$eval(
            ".a-offscreen",
            (el) => (el as HTMLElement).innerText.trim()
        );
        holePrice = holePrice.replace("$", "");

        // Scrape product image
        const productImage: string = await page.$eval(
            "#landingImage",
            (el) => (el as HTMLImageElement).src
        );

        return {
            success: true,
            code: 200,
            data: { productTitle, holePrice, productImage, platformName: "Amazon" },
        };
    } catch (error: any) {
        console.error("❌ Scraping Error:", error.message);
        return { success: false, code: 500, error: error.message };
    } finally {
        if (browser) await browser.close();
    }
};

export default scrapAmazon;
