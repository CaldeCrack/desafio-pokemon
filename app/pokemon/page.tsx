'use client';
import { useSearchParams } from "next/navigation";
import useSWR from 'swr';
import PokemonInfo from "../components/PokemonInfo";

const fetchPokemon = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'An error occurred while fetching data');
	}

	return response.json();
}

export default function PokemonPage() {
	const pokemon = useSearchParams();
	const pokemonName = pokemon ? pokemon.get('name') : null;
	const encodedPokemonName = encodeURI(pokemonName || '');

	const { data, error, isLoading } = useSWR(`/api/pokemon?name=${encodedPokemonName}`,
		fetchPokemon,
		{errorRetryCount: 0, revalidateOnError: false}
	);

	if (isLoading) return <div>Cargando...</div>;
	if (error) return <div>Pokémon no encontrado :(</div>;
	if (!data) return null;

	return (<PokemonInfo>{data}</PokemonInfo>)
}
