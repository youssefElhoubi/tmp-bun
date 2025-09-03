import scrapAmazon from "./scrapamazon";
import scrapNewEgg from "./scrapNewEgg"; 
import scrapEbay from "./scrapEbay"; 

type ScrapeResult = {
    success: boolean;
    code: number;
    data?: {
        productTitle: string;
        productImage: string;
        holePrice: string;
        platformName: string;
    };
    error?: string;
};

async function scrapeWebsite(url: string): Promise<ScrapeResult> {
    try {
        const supportedWebsites = [
            "www.amazon.com",
            "www.ebay.com",
            "www.newegg.com",
        ];

        const URLinfo = new URL(url);
        const indexOfWebsite = supportedWebsites.indexOf(URLinfo.host);

        if (indexOfWebsite === -1) {
            return {
                success: false,
                code: 400,
                error: "This website is not supported.",
            };
        }

        switch (indexOfWebsite) {
            case 0:
                return await scrapAmazon(url);
            case 1:
                return await scrapEbay(url);
            case 2:
                return await scrapNewEgg(url);
            default:
                return {
                    success: false,
                    code: 400,
                    error: "No valid scraping function found.",
                };
        }
    } catch (error: any) {
        return {
            success: false,
            code: 500,
            error: error.message,
        };
    }
}


export default scrapeWebsite;
