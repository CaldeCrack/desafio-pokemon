'use client';
import { useSearchParams } from "next/navigation";
import useSWR from 'swr';
import PokemonInfo from "../components/Pokemon";

const fetchPokemon = async (url: string) => {
	const response = await fetch(url);
	
	if(!response.ok)
		throw new Error('Fallo al buscar pokémon');

	return response.json();
}

const PokemonPage = () => {
	const pokemon = useSearchParams();
	const pokemonName = pokemon ? pokemon.get('name') : null;
	const encodedPokemonName = encodeURI(pokemonName || '');

	const { data, isLoading } = useSWR(`/api/pokemon?name=${encodedPokemonName}`, fetchPokemon);

	if (!data)
		return null;

	return (
		<PokemonInfo>
			{data}
		</PokemonInfo>
	)
}

export default PokemonPage;
