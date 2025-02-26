import type BaseCard from "./baseCard.ts";
import type PokemonCard from "./pokemonCard.ts";
import type TrainerCard from "./trainerCard.ts";

type Card = BaseCard & (PokemonCard | TrainerCard);

export default Card;
