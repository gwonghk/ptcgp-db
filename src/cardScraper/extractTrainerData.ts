import * as cheerio from "cheerio";

const regexFor = {
  trimSpacesBeforeAndAfterWords: /(?!\b\s+\b)\s+/gm,
};

const selector = {
  cardTextSection:
    ".card-details .card-details-main .card-text .card-text-section",
  cardTextFirstRow: "p.card-text-title",
  cardTextSecondRow: "p.card-text-type",
};

const extractedTrainerData = ($: cheerio.CheerioAPI) =>
  $.extract({
    trainerSubtype: {
      selector: `${selector.cardTextSection} ${selector.cardTextSecondRow}`,
      value: (el) => {
        const str = $(el)
          .text()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          ?.split("-")
          ?.at(-1);
        return str;
      },
    },
    description: {
      selector: `${selector.cardTextSection}:nth-child(2)`,
      value: (el) => {
        const str = $(el).text().trim();
        return str;
      },
    },
  });

export default extractedTrainerData;
