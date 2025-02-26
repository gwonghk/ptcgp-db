enum EnergyKeys {
  G = "grass",
  C = "colorless",
  W = "water",
  L = "lightning",
  F = "fighting",
  P = "psychic",
  D = "darkness",
  R = "fire",
}

type EnergySymbols = keyof typeof EnergyKeys;
type ContainsMax5EnergyString =
  | EnergySymbols
  | `${EnergySymbols}${EnergySymbols}`
  | `${EnergySymbols}${EnergySymbols}${EnergySymbols}`
  | `${EnergySymbols}${EnergySymbols}${EnergySymbols}${EnergySymbols}`
  | `${EnergySymbols}${EnergySymbols}${EnergySymbols}${EnergySymbols}${EnergySymbols}`;
type EnergyTypes = Record<EnergyKeys, string>;
type PokemonTypes = EnergyTypes & "dragon";
type EvolutionStages = "basic" | "stage-1" | "stage-2";

type PokemonCard = {
  type: PokemonTypes;
  hp: number;
  isEx: boolean;
  evolutionStage: EvolutionStages;
  evolvesFrom?: string | undefined;
  attacks?: {
    energyCost: ContainsMax5EnergyString;
    name: string;
    damage?: number;
    description?: string;
  }[];
  weakness?: EnergyTypes;
  retreat?: number;
};

export default PokemonCard;
