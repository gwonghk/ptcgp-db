export type CardPackIds = "P-A" | "A1" | "A1a" | "A2" | "A2a";
export type CardTypes = "pokémon" | "trainer";
type Rarities = "◊";

type BaseCard = {
  image: string;
  name: string;
  cardType: CardTypes;
  artist: string;
  rarity?: string;
  cardpackName: string;
  alternativeVersions?: [{ cardId: number; cardPackId: CardPackIds }];
  cardId: number;
  cardPackId: CardPackIds | "Error";
};

export default BaseCard;
