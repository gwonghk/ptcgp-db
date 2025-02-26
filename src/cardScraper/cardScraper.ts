import * as cheerio from "cheerio";
import type { CardPackIds, CardTypes } from "../types/baseCard.ts";
import type Card from "../types/card.ts";
import extractedPokemonData from "./extractPokemonData.ts";

const regexFor = {
  wordBetweenHyphens: /(?<=-\s*)\S.*\S(?=\s*-\s*)/,
  getIdFromURL: /(\d+)(?=$)/,
  getReleasePack: /(?<=\/cards\/)(\w+)/,
  getMiddleStringWithoutFirstWordLastNumber: /^[^\s]+\s+([A-Za-z ]+)\s+\d+$/,
  getStringAfterArtist: /(?<=artist:\s*)(\w+)/,
  trimSpacesBeforeAndAfterWords: /(?!\b\s+\b)\s+/gm,
};

const selector = {
  artist: ".card-text-artist a",
  cardPrints: ".card-prints",
  cardImage: ".card-image img",
  cardTextSection:
    ".card-details .card-details-main .card-text .card-text-section",
  cardTextSecondRow: "p.card-text-type",
  cardPrintsCurrent: ".card-prints-current .prints-current-details",
};

const cardScraper = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const cardId = Number(url.match(regexFor.getIdFromURL)?.[0]) ?? 0;
  const cardPackId =
    (url.match(regexFor.getReleasePack)?.[0] as CardPackIds) ?? "Error";

  const extractedCardData = $.extract({
    image: {
      selector: selector.cardImage,
      value: "src",
    },
    name: {
      selector: `${selector.cardTextSection} ${selector.cardTitle}`,
    },
    cardType: {
      selector: `${selector.cardTextSecondRow}`,
      value: (el) => {
        const str = $(el)
          .text()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          .toLocaleLowerCase()
          .split("-")?.[0] as CardTypes;
        return str;
      },
    },
    artist: {
      selector: `${selector.cardTextSection}${selector.artist}`,
      value: (el) => {
        const str = $(el)
          .attr("href")
          ?.match(regexFor.getStringAfterArtist)?.[0];
        return str;
      },
    },
    cardpackName: {
      selector: `${selector.cardPrintsCurrent}`,
      value: (el) => {
        const str = $(el)
          .find("span")
          .not(".text-lg")
          .text()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          .split("·")
          .at(-1);
        return str;
      },
    },
  });

  const pokemonData = extractedPokemonData($);

  const result = {
    ...pokemonData,
    cardId,
    cardPackId,
  };
  console.log(result);
  return result;
};

export default cardScraper;
