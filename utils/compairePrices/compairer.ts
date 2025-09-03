import compareEbay from "./compaireEbay";
import compareAmazon from "./compaireAmazon";
import compareNewEgg from "./compaireNewEgg";

type ScrapeResult = {
    success: boolean;
    code: number;
    data?: {
        productTitle: string;
        productImage: string;
        price: string;
        platformName: string;
    };
    error?: string;
};

type ComparisonResult = {
    [platform: string]: ScrapeResult;
};

async function comparePrice(productTitle: string, website: string): Promise<ComparisonResult | null> {
    try {
        let comparisons: ComparisonResult = {};

        switch (website.toLowerCase()) {
            case "amazon":
                comparisons.ebay = await compareEbay(productTitle);
                comparisons.newegg = await compareNewEgg(productTitle);
                break;

            case "ebay":
                comparisons.amazon = await compareAmazon(productTitle);
                comparisons.newegg = await compareNewEgg(productTitle);
                break;

            case "newegg":
                comparisons.amazon = await compareAmazon(productTitle);
                comparisons.ebay = await compareEbay(productTitle);
                break;

            default:
                throw new Error("Unsupported website. Supported websites: Amazon, eBay, Newegg.");
        }

        return comparisons;
    } catch (error: any) {
        console.error("❌ Error comparing price:", error.message);
        return null;
    }
}

export default comparePrice;
