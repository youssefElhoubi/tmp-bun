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

const compareEbay = async (title: string): Promise<ProductInfo> => {
    const browser = await puppeteer.launch({
        headless: true, // change to false for debugging
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

        // Open eBay
        await page.goto("https://www.ebay.com", {
            waitUntil: "networkidle2",
            timeout: 90_000,
        });

        // Perform search
        await page.type("#gh-ac", title);
        await page.click("#gh-search-btn");
        await page.waitForSelector(".srp-river-results.clearfix");

        // Scrape product data with error handling
        let productTitle: string;
        let productImage: string;
        let productPrice: string;

        try {
            productTitle = await page.$eval(
                "ul>li.s-item.s-item__pl-on-bottom .s-item__title",
                (el) => el.textContent?.trim() || ""
            );
        } catch {
            return { success: false, error: "Product title is missing", code: 404 };
        }

        try {
            productImage = await page.$eval(
                "ul>li.s-item.s-item__pl-on-bottom img",
                (el: HTMLImageElement) => el.src
            );
        } catch {
            return { success: false, error: "Product image is missing", code: 404 };
        }

        try {
            productPrice = await page.$eval(
                "ul>li.s-item.s-item__pl-on-bottom .s-item__price",
                (el) => (el.textContent || "").split("$")[1]?.trim() || ""
            );
        } catch {
            return { success: false, error: "Product price is missing", code: 404 };
        }

        // Format response
        return {
            success: true,
            code: 200,
            data: {
                productTitle,
                productImage,
                price: productPrice,
                platformName: "eBay",
            },
        };

    } catch (error: any) {
        return { success: false, error: error.message, code: 500 };
    } finally {
        await browser.close();
    }
};

export default compareEbay;
