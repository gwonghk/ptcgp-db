import * as cheerio from "cheerio";

const regexFor = {
  firstWord: /[A-Za-z]+/,
  getNumberAfterRetreat: /(?<=Retreat:\s*)\d+/,
  getNumbersFromEnd: /\d+$/,
  getWordAfterPokemon: /(?<=Pokémon-)[^-]+/gm,
  getWordAfterWeakness: /(?<=Weakness:\s*)(\w+)/,
  numberBeforeHP: /\d+(?=\s*HP)/gi,
  trimSpacesBeforeAndAfterWords: /(?!\b\s+\b)\s+/gm,
  wordBetweenDots: /(?<=·\s*)(.*?)(?=\s*·)/,
};

const selector = {
  allAtks: "div.card-text-attack",
  atkEffect: ".card-text-attack-effect",
  atkEnergyCost: "span.ptcg-symbol",
  atkInfo: "p.card-text-attack-info",
  cardPrintsCurrent: ".card-prints-current .prints-current-details",
  cardTextFirstRow: "p.card-text-title",
  cardTextSecondRow: "p.card-text-type",
  cardTextSection:
    ".card-details .card-details-main .card-text .card-text-section",
  cardTitle: ".card-text-title .card-text-name",
  evolutionStage: ".card-text-title .card-text-type",
  weaknessRetreat: ".card-text-wrr",
};

const extractedPokemonData = ($: cheerio.CheerioAPI) =>
  $.extract({
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
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          ?.match(regexFor.getWordAfterPokemon)?.[0]
          ?.toLowerCase()
          ?.replace(" ", "-");

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
          const damage =
            Number(atkInfo.match(regexFor.getNumbersFromEnd)?.[0]) || 0;
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
          .match(regexFor.getWordAfterWeakness)?.[0]
          ?.toLowerCase();
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

    rarity: {
      selector: `${selector.cardPrintsCurrent}`,
      value: (el) => {
        const str = $(el)
          .find("span")
          .not(".text-lg")
          .text()
          ?.replace(regexFor.trimSpacesBeforeAndAfterWords, "")
          ?.match(regexFor.wordBetweenDots)?.[0];

        return str;
      },
    },
  });

export default extractedPokemonData;
