import * as cheerio from "cheerio";

const regexFor = {
  numberBeforeHP: /\d+(?=\s*HP)/gi,
  firstWord: /[A-Za-z]+/,
  wordBetweenHyphens: /(?<=-\s*)\S.*\S(?=\s*-\s*)/,
  getIdFromURL: /(\d+)(?=$)/,
  getReleasePack: /(?<=\/cards\/)(\w+)/,
  getNumbersFromEnd: /\d+$/,
  getMiddleStringWithoutFirstWordLastNumber: /^[^\s]+\s+([A-Za-z ]+)\s+\d+$/,
  getWordAfterWeakness: /(?<=Weakness:\s*)(\w+)/,
  getStringAfterArtist: /(?<=artist:\s*)(\w+)/,
  getNumberAfterRetreat: /(?<=Retreat:\s*)\d+/,
  trimSpacesBeforeAndAfterWords: /(?!\b\s+\b)\s+/gm,
};

const selector = {
  cardImage: ".card-image img",
  cardTextSection:
    ".card-details .card-details-main .card-text .card-text-section",
  cardTitle: ".card-text-title .card-text-name",
  cardTextFirstRow: "p.card-text-title:contains('HP')",
  cardTextSecondRow: "p.card-text-type",
  evolutionStage: ".card-text-title .card-text-type",
  allAtks: "div.card-text-attack",
  atkInfo: "p.card-text-attack-info",
  atkEnergyCost: "span.ptcg-symbol",
  atkEffect: ".card-text-attack-effect",
  weaknessRetreat: ".card-text-wrr",
  artist: ".card-text-artist a",
  cardPrints: ".card-prints",
  cardPrintsCurrent: ".card-prints-current .prints-current-details",
  cardPrintsVersions: ".card-prints-versions",
};

const typeEnum = {
  G: "grass",
  C: "colorless",
};

type CardData = {
  color: string;
};

const main = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const extracted = $.extract({
    image: {
      selector: selector.cardImage,
      value: "src",
    },
    title: {
      selector: `${selector.cardTextSection} ${selector.cardTitle}`,
    },
    isEx: {
      selector: `${selector.cardTextSection} ${selector.cardTitle}`,
      value: (el) => $(el).text().includes(" ex"),
    },
    type: {
      selector: `${selector.cardTextSection} ${selector.cardTextFirstRow}`,
      value: (el) => {
        const str = $(el)
          .contents()
          .last()
          .text()
          .trim()
          .match(regexFor.firstWord)?.[0]
          ?.toLowerCase();
        return str;
      },
    },
    hp: {
      selector: `${selector.cardTextSection} ${selector.cardTextFirstRow}`,
      value: (el) => {
        const str = $(el)
          .contents()
          .last()
          .text()
          .trim()
          .match(regexFor.numberBeforeHP)?.[0];
        return Number(str);
      },
    },
    evolutionStage: {
      selector: `${selector.cardTextSection} ${selector.cardTextSecondRow}`,
      value: (el) => {
        const str = $(el)
          .contents()
          .text()
          .trim()
          .match(regexFor.wordBetweenHyphens)?.[0]
          ?.toLowerCase();
        return str;
      },
    },
    evolvesFrom: {
      selector: `${selector.cardTextSection} ${selector.cardTextSecondRow} a`,
      value: (el) => {
        const str = $(el).contents().text().trim();
        return str;
      },
    },
    attacks: [
      {
        selector: `${selector.cardTextSection} ${selector.allAtks}`,
        value: (el, k) => {
          const energyCost = $(el).find(selector.atkEnergyCost).text().trim();

          const atkInfo = $(el).find(selector.atkInfo).text().trim();
          const damage = Number(atkInfo.match(regexFor.getNumbersFromEnd)?.[0]);
          const attackName = atkInfo.split(" ").slice(1, -1).join(" ").trim();
          const description = $(el)
            .find(".card-text-attack-effect")
            .text()
            .trim();

          return {
            energyCost,
            name: attackName,
            damage,
            description,
          };
        },
      },
    ],
    weakness: {
      selector: `${selector.cardTextSection} ${selector.weaknessRetreat}`,
      value: (el) => {
        const weakness = $(el)
          .html()
          ?.replace(/(\r\n|\n|\r| )/gm, "")
          .match(regexFor.getWordAfterWeakness)?.[0];
        return weakness;
      },
    },
    retreat: {
      selector: `${selector.cardTextSection} ${selector.weaknessRetreat}`,
      value: (el) => {
        const retreat = $(el)
          .html()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          .match(regexFor.getNumberAfterRetreat)?.[0];
        return Number(retreat);
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
    rarity: {
      selector: `${selector.cardPrintsCurrent}`,
      value: (el) => {
        const str = $(el)
          .find("span")
          .not(".text-lg")
          .text()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "");

        console.log(str);
      },
    },
  });

  const id = Number(url.match(regexFor.getIdFromURL)?.[0]);
  const cardpackId = url.match(regexFor.getReleasePack)?.[0];

  const result = {
    ...extracted,
    id,
    cardpackId,
  };
  console.log(result);
};

export default main;
