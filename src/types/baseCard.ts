export type CardPackIds = "A1" | undefined;
export type CardTypes = "pokémon" | "trainer" | undefined;
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
