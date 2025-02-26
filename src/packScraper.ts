import * as cheerio from "cheerio";

const packScraper = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const totalPacks = $(".card-search-grid").find("a").length;

  console.log(totalPacks);
};

export default packScraper;
