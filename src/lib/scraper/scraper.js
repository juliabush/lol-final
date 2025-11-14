import fs from "fs";
import { READABLE_REGIONS } from "../constants.ts";

const validateListing = (listing) => {
  return typeof listing.row === "string" && listing.row.trim().length > 0;
};

export const scrapeListings = async ({ browser, retryCount = 0 }) => {
  let results = [];
  for (const region of READABLE_REGIONS) {
    let page, context;
    let regionListings = [];
    try {
      context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1366, height: 768 },
      });
      page = await context.newPage();

      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(30000);

      for (let pageIndex = 1; pageIndex <= 15; pageIndex++) {
        const url = `https://www.op.gg/lol/leaderboards/level?region=${region.toLowerCase()}&page=${pageIndex}`;
        await page.goto(url, { waitUntil: "networkidle" });

        try {
          await page.waitForSelector("table tbody tr", { timeout: 10000 });
        } catch {
          break;
        }

        const listings = await page.$$eval("table tbody tr", (rows) =>
          rows.slice(0, 100).map((row) => ({
            row: row.innerText || "N/A",
          }))
        );

        const validListings = listings.filter(validateListing);
        if (validListings.length === 0) {
          break;
        }

        regionListings.push(...validListings);
      }

      results.push({ region, listings: regionListings });
    } catch (error) {
      if (page) {
        try {
          const screenshotPath = `debug-${Date.now()}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
        } catch {}
      }
    } finally {
      if (page) await page.close();
      if (context) await context.close();
    }
  }

  fs.writeFileSync("results.json", JSON.stringify(results, null, 2), "utf-8");
  return results;
};
