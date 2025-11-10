import express from "express";
import { chromium } from "playwright-extra";
import cors from "cors";
import { scrapeListings } from "./scraper.js";

const app = express();
const PORT = 5001;

app.use(cors());

app.get("/scrape", async (req, res) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const listings = await scrapeListings({ browser });
    res.json(listings);
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper server running on http://localhost:${PORT}`);
});
