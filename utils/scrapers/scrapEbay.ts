import { Browser, Page } from "puppeteer";
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

const scrapEbay = async (url: string): Promise<ProductInfo> => {
    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless: true, // Runs in headless mode for efficiency
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page: Page = await browser.newPage();

        // Set user agent to mimic real users
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.120 Safari/537.36"
        );

        // Set headers to avoid bot detection
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
        });

        // Navigate to the eBay product page
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 90000,
        });

        // Scrape product title
        const productTitle: string = await page.$eval(
            "#mainContent .vim .vim h1 span",
            (el) => (el as HTMLElement).innerText.trim()
        );

        // Scrape product price
        const holePrice: string = await page.$eval(
            "#mainContent .x-price-section .x-bin-price__content div span",
            (el) => (el as HTMLElement).innerText.replace(/[^0-9.]/g, "")
        );

        // Scrape product image
        const productImage: string = await page.$eval(
            ".image img",
            (el) => (el as HTMLImageElement).src
        );

        return {
            success: true,
            code: 200,
            data: { productTitle, holePrice, productImage, platformName: "eBay" },
        };
    } catch (error: any) {
        console.error("❌ Scraping Error:", error.message);
        return { success: false, code: 500, error: error.message };
    } finally {
        if (browser) await browser.close();
    }
};

export default scrapEbay;
