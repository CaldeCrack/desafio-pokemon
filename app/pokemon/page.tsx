'use client';
import { useSearchParams } from "next/navigation";
import useSWR from 'swr';
import PokemonInfo from "../components/PokemonInfo";

const fetchPokemon = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar pokémon');

	return response.json();
}

export default function PokemonPage() {
	const pokemon = useSearchParams();
	const pokemonName = pokemon ? pokemon.get('name') : null;
	const encodedPokemonName = encodeURI(pokemonName || '');

	const { data, isLoading } = useSWR(`/api/pokemon?name=${encodedPokemonName}`, fetchPokemon);

	if (isLoading) return <div>Cargando...</div>;
	if (!data) return null;

	return (<PokemonInfo>{data}</PokemonInfo>)
}
