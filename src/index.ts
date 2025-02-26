import express, { urlencoded, json } from "express";
import cardScraper from "./cardScraper/cardScraper.ts";
import packScraper from "./packScraper.ts";

const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

const baseURL = "https://quotes.toscrape.com";
const baseURL2 = "https://sandbox.oxylabs.io/products/1";
const baseURL4 = "https://gamevlg.com/pokemon-tcg-pocket/cards/1";

const baseURL3 = "https://pocket.limitlesstcg.com/cards/A1/4";
// 4 - pokemon - venusaur
// 226 - trainer/supporter
// 217 - trainer/item
const potionURL = "https://pocket.limitlesstcg.com/cards/P-A/1";
const cardPackUrl = "https://pocket.limitlesstcg.com/cards/A1";

cardScraper(baseURL3);
// packScraper(cardPackUrl);
